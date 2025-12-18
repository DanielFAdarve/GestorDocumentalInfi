// const nodemailer = require("nodemailer");
// const { Op } = require("sequelize");

// class NotificationService {
//   constructor(models) {
//     this.models = models;

//     this.transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: Number(process.env.EMAIL_PORT),
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_OCGN,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     });
//   }

//   /**
//    * Obtiene todos los soportes pendientes y envía correo.
//    */
//   async notifyPendingSupports() {
//     const pending = await this.models.ContractSupport.findAll({
//       where: { status: "pending" },
//       include: [
//         { model: this.models.Support, as: "support" },
//         { model: this.models.User, as: "responsible" },
//         { model: this.models.Contract, as: "contract" }
//       ]
//     });

//     if (pending.length === 0) {
//       return { message: "No hay soportes pendientes." };
//     }

//     const results = [];
//     for (const item of pending) {
//       const daysPending = this._calcDaysPending(item.created_at);
//       const expiresIn = this._calcDaysUntil(item.due_date);

//       const res = await this._sendEmail({
//         to: item.responsible?.email,
//         subject: `Soporte pendiente: ${item.support?.name}`,
//         html: this._buildEmailHtml(item, daysPending, expiresIn)
//       });

//       results.push({ id: item.id, email: item.responsible?.email, status: res });
//     }

//     return results;
//   }

//   _calcDaysPending(date) {
//     const d1 = new Date(date);
//     const d2 = new Date();
//     return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
//   }

//   _calcDaysUntil(date) {
//     if (!date) return "No definido";
//     const d1 = new Date();
//     const d2 = new Date(date);
//     return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
//   }

//   async _sendEmail({ to, subject, html }) {
//     try {
//         const for_email_reminder  = "dfadarve@cyt.com.co"
//       await this.transporter.sendMail({
//         from: `"Gestor Documental" <${process.env.EMAIL_OCGN}>`,
//         to,
//         subject,
//         html
//       });
//       return "sent";
//     } catch (err) {
//       return "error: " + err.message;
//     }
//   }

//   _buildEmailHtml(item, daysPending, expiresIn) {
//     return `
//       <div style="font-family: Arial; padding: 20px;">
//         <h2 style="color:#1a73e8;">Notificación de soporte pendiente</h2>

//         <p><b>Soporte:</b> ${item.support?.name}</p>
//         <p><b>Contrato:</b> ${item.contract?.name || item.contract?.contract_number}</p>
//         <p><b>Responsable:</b> ${item.responsible?.name || item.responsible?.username}</p>
//         <p><b>Fecha de vencimiento:</b> ${item.due_date || "No definida"}</p>

//         <p style="color:#e53935;">
//           <b>Días pendientes:</b> ${daysPending} días
//         </p>

//         <p style="color:#fb8c00;">
//           <b>Días para vencimiento:</b> ${expiresIn}
//         </p>

//         <br/>
//         <p>
//           Por favor ingrese al sistema y cargue la evidencia correspondiente.
//         </p>

//         <hr/>
//         <small>Este es un correo automático, por favor no responda a este mensaje.</small>
//       </div>
//     `;
//   }
// }

// module.exports = NotificationService;


const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");

class NotificationService {
  constructor(models) {
    this.models = models;

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_OCGN,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async notifyPendingSupports() {
    const pending = await this.models.ContractSupport.findAll({
      where: { status: "pending" },
      include: [
        { model: this.models.Support, as: "support" },
        { model: this.models.User, as: "responsible" },
        { model: this.models.Contract, as: "contract" }
      ]
    });

    if (!pending.length) {
      return { message: "No hay soportes pendientes." };
    }

    // 1. Crear Excel
    const excelBuffer = await this._buildExcel(pending);

    // 2. Enviar correo único con adjunto
    await this._sendEmailWithAttachment({
      subject: "Reporte de soportes pendientes",
      html: this._buildEmailHtml(pending.length),
      attachment: excelBuffer
    });

    return {
      message: "Correo enviado con reporte de soportes pendientes",
      total: pending.length
    };
  }

  async _buildExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Soportes Pendientes");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Soporte", key: "support", width: 30 },
      { header: "Contrato", key: "contract", width: 30 },
      { header: "Responsable", key: "responsible", width: 30 },
      { header: "Correo Responsable", key: "email", width: 30 },
      { header: "Fecha Creación", key: "created", width: 20 },
      { header: "Fecha Vencimiento", key: "due", width: 20 },
      { header: "Días Pendientes", key: "daysPending", width: 18 },
      { header: "Días para Vencer", key: "expiresIn", width: 20 }
    ];

    data.forEach(item => {
      const daysPending = this._calcDaysPending(item.created_at);
      const expiresIn = this._calcDaysUntil(item.due_date);

      sheet.addRow({
        id: item.id,
        support: item.support?.name || "",
        contract: item.contract?.name || item.contract?.contract_number || "",
        responsible: item.responsible?.name || item.responsible?.username || "",
        email: item.responsible?.email || "",
        created: item.created_at,
        due: item.due_date || "No definida",
        daysPending,
        expiresIn
      });
    });

    // Estilo encabezado
    sheet.getRow(1).font = { bold: true };

    return workbook.xlsx.writeBuffer();
  }

  _calcDaysPending(date) {
    const d1 = new Date(date);
    const d2 = new Date();
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
  }

  _calcDaysUntil(date) {
    if (!date) return "No definido";
    const d1 = new Date();
    const d2 = new Date(date);
    return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  }

  async _sendEmailWithAttachment({ subject, html, attachment }) {
    await this.transporter.sendMail({
      from: `"Gestor Documental" <${process.env.EMAIL_OCGN}>`,
      // to: process.env.EMAIL_OCGN, // o lista de correos
      to: 'dfadarve@cyt.com.co', // o lista de correos
      subject,
      html,
      attachments: [
        {
          filename: "soportes_pendientes.xlsx",
          content: attachment
        }
      ]
    });
  }

  _buildEmailHtml(total) {
    return `
      <div style="font-family: Arial; padding: 20px;">
        <h2 style="color:#1a73e8;">Reporte de soportes pendientes</h2>

        <p>
          Se adjunta el archivo Excel con el detalle de los soportes pendientes.
        </p>

        <p>
          <b>Total de soportes pendientes:</b> ${total}
        </p>

        <hr/>
        <small>
          Este correo fue generado automáticamente. No responda a este mensaje.
        </small>
      </div>
    `;
  }
}

module.exports = NotificationService;
