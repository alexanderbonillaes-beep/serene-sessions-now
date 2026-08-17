import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, FileText, Mail } from "lucide-react";
import { EMAIL } from "@/lib/contact";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad y Tratamiento de Datos | Alexander Bonilla" },
      {
        name: "description",
        content:
          "Política de privacidad y tratamiento de datos personales de Alexander Bonilla, psicólogo clínico. Cumplimiento de la Ley N° 21.719 de Protección de Datos Personales de Chile. No utilizamos cookies.",
      },
      { property: "og:title", content: "Política de Privacidad | Alexander Bonilla" },
      {
        property: "og:description",
        content:
          "Tratamiento de datos personales conforme a la Ley N° 21.719 de Chile. No utilizamos cookies.",
      },
      { property: "og:url", content: "https://www.psalexanderbonilla.cl/privacidad" },
    ],
    links: [{ rel: "canonical", href: "https://www.psalexanderbonilla.cl/privacidad" }],
  }),
  component: PrivacidadPage,
});

function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl text-foreground">
            Política de Privacidad y Tratamiento de Datos Personales
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Última actualización: agosto 2026
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-foreground/90">
        <section className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="h-4 w-4 text-primary" />
            <h2 className="font-display text-xl text-foreground">1. Sin cookies</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Este sitio web <strong>no utiliza cookies</strong> ni tecnologías
            de seguimiento similares. No recopilamos información de navegación
            a través de cookies, píxeles, balizas web ni rastreadores de
            terceros. Su visita a este sitio no deja rastros almacenados en su
            navegador.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="font-display text-xl text-foreground">
              2. Marco legal
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            La presente política se rige por la <strong>Ley N° 21.719 que
            modifica la Ley N° 19.628 sobre Protección de la Vida Privada</strong>,
            conocida como la nueva Ley de Protección de Datos Personales de
            Chile, publicada el 26 de diciembre de 2024 y que entró en vigencia
            en diciembre de 2025. Asimismo, se encuentra alineada con los
            principios del Código de Ética y Deontología del Colegio de
            Psicólogos de Chile, que exigen el resguardo del secreto
            profesional y la confidencialidad de la información clínica.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            3. Responsable del tratamiento
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            El responsable del tratamiento de los datos personales es{" "}
            <strong>Alexander De Jesús Bonilla Espinoza</strong>, psicólogo
            clínico, con domicilio profesional en Av.
            Balmaceda 2195, Edificio Portal las Higueras, Oficina 401, La
            Serena, Región de Coquimbo, Chile. Puede contactarse a través del
            correo electrónico{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-primary underline hover:opacity-80"
            >
              {EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            4. Datos que tratamos
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground mb-3">
            Tratamos exclusivamente los datos personales que usted nos
            proporciona de forma voluntaria, con finalidad clínica y
            administrativa:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>
              <strong>De identificación:</strong> nombre, fecha de
              nacimiento, correo electrónico, teléfono y dirección.
            </li>
            <li>
              <strong>De contacto y agendamiento:</strong> fecha y hora de
              sesiones solicitadas vía Calendly, y preferencias de
              comunicación.
            </li>
            <li>
              <strong>Clínicos:</strong> antecedentes y información relevante
              para el proceso terapéutico, tratados bajo estricta
              confidencialidad y secreto profesional.
            </li>
            <li>
              <strong>De pago:</strong> comprobantes y datos necesarios para
              la facturación, sin almacenar datos de tarjetas.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            5. Finalidad del tratamiento
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground mb-3">
            Sus datos se utilizan única y exclusivamente para:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Brindar atención psicológica y acompañamiento terapéutico.</li>
            <li>Agendar, confirmar y reprogramar sesiones.</li>
            <li>Gestionar pagos y emitir comprobantes.</li>
            <li>Enviar comunicaciones relacionadas con su proceso clínico.</li>
            <li>Cumplir con obligaciones legales y regulatorias.</li>
          </ul>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            No compartimos ni comercializamos sus datos con terceros con fines
            comerciales. La información clínica solo podrá ser revelada cuando
            medie su consentimiento expreso o por mandato legal (por ejemplo,
            obligaciones de denuncia conforme al Código Penal).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            6. Base jurídica y consentimiento
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            El tratamiento se basa en su <strong>consentimiento libre,
            previo, informado y expreso</strong>, solicitado al momento de
            iniciar el proceso terapéutico. Puede retirar su consentimiento en
            cualquier momento, sin que ello afecte la licitud del tratamiento
            previo. En el ámbito clínico, el tratamiento también se sustenta
            en la relación de cuidado terapéutico y en el cumplimiento de
            deberes legales del profesional.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            7. Conservación de los datos
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Los datos clínicos se conservan durante el plazo necesario para
            cumplir con las finalidades del tratamiento y conforme a las
            obligaciones de guarda y custodia que establece la normativa
            sanitaria y deontológica. Una vez vencido dicho plazo, se
            procederá a su supresión o anonimización.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            8. Derechos ARCO y otros derechos
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground mb-3">
            Conforme a la Ley N° 21.719, usted tiene derecho a ejercer de
            forma gratuita los siguientes derechos frente al responsable del
            tratamiento:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>
              <strong>Acceso:</strong> saber qué datos personales tenemos sobre
              usted.
            </li>
            <li>
              <strong>Rectificación:</strong> corregir datos inexactos o
              incompletos.
            </li>
            <li>
              <strong>CANCELACIÓN (Supresión):</strong> solicitar la
              eliminación de sus datos, salvo que existan obligaciones legales
              de conservación.
            </li>
            <li>
              <strong>Oposición:</strong> oponerse al tratamiento por motivos
              legítimos.
            </li>
            <li>
              <strong>Información:</strong> ser informado sobre el tratamiento
              y sus características.
            </li>
            <li>
              <strong>Portabilidad:</strong> recibir sus datos en formato
              estructurado para transferirlos a otro responsable.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            Para ejercer estos derechos, envíe una solicitud al correo{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-primary underline hover:opacity-80"
            >
              {EMAIL}
            </a>{" "}
            indicando el derecho que desea ejercer. Responderemos dentro del
            plazo máximo de 30 días hábiles establecido por la ley.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            9. Medidas de seguridad
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Se aplican medidas técnicas y organizativas apropiadas para
            proteger sus datos personales frente a acceso no autorizado,
            pérdida, alteración o divulgación. La información clínica se
            mantiene bajo estricta confidencialidad y secreto profesional. En
            caso de detectarse una brecha de seguridad que afecte sus datos,
            se actuará conforme a lo dispuesto en la Ley N° 21.719 y se le
            notificará conforme a la normativa vigente.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            10. Transferencias y encargados
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Algunos datos pueden ser tratados por encargados que prestan
            servicios necesarios para la atención (por ejemplo, plataformas de
            agendamiento como Calendly y de pagos como Flow), bajo
            obligaciones de confidencialidad y seguridad. Estas transferencias
            se limitan a lo estrictamente necesario y no implican cesión de
            datos con fines comerciales. Chile puede considerarse un país con
            nivel adecuado de protección para los efectos de transferencias
            internacionales.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            11. Menores de edad
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            En el caso de niñas, niños y adolescentes, el tratamiento de sus
            datos se realiza con el consentimiento de quien ejerza el cuidado
            personal o la representación legal, en conformidad con lo
            establecido en la Ley N° 21.719 y la normativa de protección de
            la infancia.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            12. Reclamos
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Si considera que sus derechos han sido vulnerados, puede presentar
            un reclamo ante la <strong>Agencia de Protección de Datos
            Personales</strong>, autoridad competente creada por la Ley N°
            21.719. Previamente, puede dirigirse al responsable del
            tratamiento mediante el correo electrónico de contacto.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground mb-3">
            13. Modificaciones
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Esta política podrá ser actualizada para reflejar cambios
            normativos o en nuestras prácticas de tratamiento. La fecha de
            última actualización se indica al inicio de este documento.
          </p>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-primary" />
            <h2 className="font-display text-xl text-foreground">
              Contacto para privacidad
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Para cualquier consulta, solicitud o ejercicio de derechos
            relacionados con sus datos personales, escriba a{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-primary underline hover:opacity-80"
            >
              {EMAIL}
            </a>{" "}
            o al WhatsApp profesional indicado en el sitio.
          </p>
        </section>
      </div>
    </div>
  );
}
