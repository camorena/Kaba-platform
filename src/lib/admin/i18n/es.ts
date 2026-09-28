/** Formal Colombian Spanish (es-CO, usted) — admin UI */
import type { DictNode } from "./types";

const es = {
  nav: {
    admin: "Admin",
    dashboard: "Panel",
    quotes: "Cotizaciones",
    pipeline: "Pipeline",
    invoices: "Facturas",
    payments: "Pagos",
    customers: "Clientes",
    schedule: "Agenda",
    pricebook: "Lista de precios",
    templates: "Plantillas",
    activity: "Actividad",
    reports: "Informes",
    content: "Contenido",
    settings: "Configuración",
    navigate: "Navegación"
  },
  shell: {
    brand: "Kaba Fence Admin",
    tagline: "Cotizaciones · facturas · operaciones",
    search: "Buscar",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    openCommandPalette: "Abrir paleta de comandos",
    keyboardShortcuts: "Atajos de teclado",
    viewSite: "Ver sitio",
    signOut: "Cerrar sesión",
    signedOut: "Sesión cerrada",
    authStubStrong: "Autenticación provisional — no apta para producción.",
    authWarning:
      "Puerta por cookie de contraseña solo para el andamiaje. Defina AUTH_SECRET para credenciales contra profiles, o conserve el stub para demos — antes de datos reales de clientes en producción.",
    adminNav: "Navegación del administrador",
    jumpHint: "Presione __KBD__ para ir a cualquier sección.",
    creditPrefix: "Sitio elaborado por"
  },
  lang: {
    label: "Idioma",
    en: "EN",
    es: "ES"
  },
  common: {
    all: "Todos",
    cancel: "Cancelar",
    confirm: "Confirmar",
    dismiss: "Cerrar",
    working: "Procesando…",
    saving: "Guardando…",
    updating: "Actualizando…",
    creating: "Creando…",
    clear: "Limpiar",
    clearFilters: "Limpiar filtros",
    exportCsv: "Exportar CSV",
    viewAll: "Ver todas",
    board: "Tablero",
    copied: "Copiado",
    copyFailed: "No se pudo copiar",
    copySummary: "Copiar resumen",
    copyEmail: "Copiar correo",
    copyPhone: "Copiar teléfono",
    breadcrumb: "Ruta de navegación",
    noMatches: "Sin coincidencias",
    noMatchesDesc: "Pruebe otra búsqueda o limpie los filtros.",
    showingOf: "Mostrando {filtered} de {total}",
    selected: "{count} seleccionada",
    selected_plural: "{count} seleccionadas",
    items: "{count} elemento",
    items_plural: "{count} elementos",
    more: "+{count} más",
    jobs: "{count} trabajos",
    contacts: "{count} contacto",
    contacts_plural: "{count} contactos",
    quotesCount: "{count} cotización",
    quotesCount_plural: "{count} cotizaciones",
    due: "por cobrar",
    latest: "Última {date}",
    openPublicQuote: "Abrir formulario público",
    openQuoteForm: "Abrir formulario de cotización",
    pipelineBoard: "Tablero del pipeline",
    statusUpdateFailed: "No se pudo actualizar el estado",
    bulkUpdateFailed: "No se pudo actualizar de forma masiva",
    statusArrow: "Estado → {status}",
    updatedArrow: "Actualizadas {count} → {status}",
    csvExported: "CSV exportado · {count} cotización",
    csvExported_plural: "CSV exportado · {count} cotizaciones",
    csvExportedInvoices: "CSV exportado · {count} factura",
    csvExportedInvoices_plural: "CSV exportado · {count} facturas",
    phone: "Teléfono",
    email: "Correo",
    created: "Creada",
    demoData: "Datos de demostración",
    selectEllipsis: "Seleccione…"
  },
  status: {
    quote: {
      new: "Nueva",
      contacted: "Contactada",
      scheduled: "Agendada",
      won: "Ganada",
      lost: "Perdida"
    },
    invoice: {
      draft: "Borrador",
      sent: "Enviada",
      partial: "Parcial",
      paid: "Pagada",
      void: "Anulada"
    },
    payment: {
      recorded: "Registrado",
      pending: "Pendiente",
      failed: "Fallido"
    },
    method: {
      check: "Cheque",
      cash: "Efectivo",
      ach: "ACH",
      card: "Tarjeta",
      other: "Otro"
    }
  },
  timeline: {
    quoteProgress: "Progreso de la cotización",
    invoiceProgress: "Progreso de la factura",
    pipelineEnded: "Pipeline cerrado",
    issued: "Emitida"
  },
  pages: {
    dashboard: {
      title: "Panel",
      description:
        "Resumen operativo: pendientes, pipeline y movimiento reciente. Montos de demostración; la autenticación sigue siendo provisional.",
      needsAttention: "Requiere atención",
      newQuotes: "Cotizaciones nuevas",
      openInvoices: "Facturas abiertas",
      collected: "Recaudado",
      won: "Ganadas",
      totalHint: "{count} en total",
      stubPayments: "{count} pagos de prueba",
      scheduledHint: "{count} agendada",
      scheduledHint_plural: "{count} agendadas",
      pipelineFunnel: "Embudo de cotizaciones",
      recentQuotes: "Cotizaciones recientes",
      invoices: "Facturas",
      payments: "Pagos",
      emptyTitle: "El pipeline está vacío",
      emptyDesc:
        "Cuando los clientes envíen el formulario público, las cotizaciones recientes aparecerán aquí.",
      templatesHint: "Copiar seguimientos",
      pricebookHint: "Tarifas de referencia",
      newQuoteMeta: "Cotización nueva · {service}",
      invoiceMeta: "{status} · {customer}",
      goneQuiet: "Sin respuesta",
      goneQuietHint: "Sin movimiento por {days}+ días",
      goneQuietIntro:
        "Cotizaciones abiertas (nueva, contactada o agendada) sin actualización de estado o notas durante {days} días o más. Son las fugas Estimado → Silencio.",
      quietForDays: "En silencio desde hace {count} día",
      quietForDays_plural: "En silencio desde hace {count} días",
      viewQuietQuotes: "Ver todas las cotizaciones en silencio →",
      unknownHint: "No se pudo leer",
      beforeLaunch: "Antes del lanzamiento",
      outstandingCount: "{count} pendiente",
      outstandingCount_plural: "{count} pendientes",
      blockersClear: "Todo listo",
      blockerDone: " — listo",
      blockerOutstanding: " — pendiente",
      blockerPhotos: "Fotografías de trabajos reales",
      blockerPhotosDetail:
        "La galería aún depende de imágenes de marketing. Proyectos debe mostrar trabajos construidos por Kaba: agregue fotos reales del sitio antes de atribuir autoría.",
      blockerAuth: "Autenticación real",
      blockerAuthStub:
        "La puerta provisional ADMIN_PASSWORD está configurada, pero no es autenticación multiusuario. Defina AUTH_SECRET para credenciales contra profiles, o conserve el stub para demos — vea Configuración → Seguridad y src/lib/admin/dal.ts.",
      blockerAuthCredentials:
        "El modo de credenciales está activo (AUTH_SECRET + profiles.role). Aún debe añadir MFA, límites de tasa y secretos de producción antes de PII real — vea Configuración → Seguridad.",
      blockerAuthCredentialsMissing:
        "Falta AUTH_SECRET o el secreto no está definido. Configure AUTH_SECRET y siembre un perfil owner.",
      blockerAuthMissing:
        "ADMIN_PASSWORD no está configurada. Defínala en local y en Vercel, o configure AUTH_SECRET para el modo de credenciales.",
      blockerDb: "Base de datos durable",
      blockerDbDetail:
        "Cotizaciones, facturas y pagos están en memoria. Los arranques en frío reinician la lista. Persista antes de confiar en leads de producción (persistir y luego notificar).",
      blockerStripe: "Stripe (o riel de pagos)",
      blockerStripeDetail:
        "Las claves de Stripe no están definidas — Pagos muestra “sin conexión”; aún no hay Checkout ni webhooks.",
      blockerStripePartial:
        "STRIPE_SECRET_KEY está definida (Checkout listo) pero falta STRIPE_WEBHOOK_SECRET — los pagos no se registrarán desde Stripe hasta conectar el webhook.",
      blockerStripeWired:
        "El andamiaje de Stripe Checkout + webhook está activo. Aún debe probar en modo de prueba de Stripe, confirmar depósitos y endurecer antes de cobros en vivo.",
      blockerHours: "Horario y contacto",
      blockerHoursOk:
        "El sitio público muestra {phone} · {email}. Horario: {hours}. Los campos de negocio editables pasarán a Configuración cuando exista la base de datos.",
      blockerHoursMissing:
        "Faltan teléfono, correo u horario en la configuración del sitio. Un contratista local pierde llamadas sin horario claro."
    },
    quotes: {
      title: "Cotizaciones",
      description:
        "Solicitudes del formulario público y filas de demostración. Datos en memoria: se reinician en arranques en frío hasta conectar una base de datos."
    },
    pipeline: {
      title: "Pipeline",
      description:
        "Vista kanban de las etapas de cotización. Arrastre tarjetas o avance el estado. Mismo almacenamiento en memoria que Cotizaciones."
    },
    invoices: {
      title: "Facturas",
      description:
        "Facturas de demostración con montos sintéticos. Cree borradores desde cotizaciones; PDF, correo y precios reales vendrán después."
    },
    payments: {
      title: "Pagos",
      description:
        "Libro vinculado a facturas. El registro manual siempre funciona; Stripe Checkout se abre cuando hay claves."
    },
    customers: {
      title: "Clientes",
      description:
        "Derivados de contactos de cotización (correo/teléfono). No es un CRM: las claves únicas consolidan envíos duplicados.",
      meta: "Relación · provisional",
      emptyTitle: "Aún no hay clientes",
      emptyDesc: "Los clientes aparecen cuando llegan cotizaciones al sistema.",
      directory: "Directorio",
      colCustomer: "Cliente",
      colQuotes: "Cotizaciones",
      colLocations: "Ubicaciones",
      colLatest: "Más reciente"
    },
    schedule: {
      title: "Agenda",
      description:
        "Calendario provisional de visitas e instalaciones a partir de cotizaciones agendadas o ganadas. Aún no es un sistema de reservas.",
      meta: "Operaciones de campo · demo",
      upcoming: "Próximos trabajos",
      emptyTitle: "Sin trabajos agendados",
      emptyDesc:
        "Marque una cotización como agendada o ganada para generar trabajos de demostración.",
      dow: {
        sun: "Dom",
        mon: "Lun",
        tue: "Mar",
        wed: "Mié",
        thu: "Jue",
        fri: "Vie",
        sat: "Sáb"
      }
    },
    pricebook: {
      title: "Lista de precios",
      meta: "Estimación · local",
      description:
        "Tarifas de campo para estimados rápidos. Los cambios permanecen en su navegador (localStorage): sin Stripe ni base de datos."
    },
    templates: {
      title: "Plantillas",
      description:
        "Mensajes SMS, correo y notas internas con campos dinámicos. Copie al portapapeles: sin API de mensajería."
    },
    activity: {
      title: "Actividad",
      description:
        "Feed unificado de actualizaciones de cotizaciones, facturas y pagos desde el almacenamiento en memoria.",
      emptyTitle: "Sin actividad por ahora",
      emptyDesc:
        "Los eventos del pipeline aparecerán aquí a medida que avancen cotizaciones y facturas.",
      kindQuote: "Cotización",
      kindInvoice: "Factura",
      kindPayment: "Pago"
    },
    reports: {
      title: "Informes",
      description:
        "Resumen operativo ligero: solo gráficos SVG/CSS. Montos de demostración; sin proveedor de analítica."
    },
    content: {
      title: "Contenido",
      description: "CMS fases A–C con cortes públicos: FAQ, testimonios, proyectos, tipos de cerca, servicios, nosotros, materiales, zona de servicio y process.* site-copy → páginas públicas. Las afirmaciones de confianza quedan en Ajustes. Otras claves siguen en site.ts.",
      meta: "CMS en memoria · FAQ / reseñas / galería / servicios / nosotros / materiales / pueblos en vivo",
      hubIntro: "Gestione el contenido público de marketing desde el admin. Las insignias verdes En vivo marcan tipos cuyo estado Publicado actualiza el sitio (CMS → respaldo site.ts si no hay publicados).",
      phaseA: "Fase A — productos y FAQ",
      phaseB: "Fase B — textos y páginas estructuradas",
      phaseC: "Fase C — biblioteca de medios",
      liveBadge: "En vivo · {paths}",
      adminOnlyBadge: "Solo admin",
      publishAffects: "Publicado actualiza: {paths}",
      publishAdminOnly: "El estado Publicado es solo admin hasta el corte de este tipo.",
      upcomingTitle: "Planificado — contenido del sitio público",
      upcomingBody: "Hoja de ruta restante (bilingüismo público). Vea preview/CMS_PUBLIC_CONTENT_PLAN.md.",
      phaseBadge: "Fase {phase}",
      replaces: "Reemplazará: {source}",
      count: "{count} elemento",
      count_plural: "{count} elementos",
      mirrors: "Refleja {source} en site.ts",
      publicPath: "Público: {path}",
      listHintLive: "Editando {plural} en memoria. Los Publicados aparecen en {paths} (si ninguno está publicado, se usa site.ts).",
      listHintAdmin: "Editando {plural} en memoria. Publicado aún no cambia el sitio en vivo — sigue site.ts.",
      backHub: "Todos los tipos de contenido",
      backList: "Volver a la lista",
      colTitle: "Título",
      colStatus: "Estado",
      colOrder: "Orden",
      colUpdated: "Actualizado",
      statusPublished: "Publicado",
      statusDraft: "Borrador",
      statusHelpLive: "Publicado → aparece en {paths}. Si todos están en Borrador, la página pública vuelve a site.ts.",
      statusHelpAdmin: "Publicado se guarda solo en memoria. Este tipo no está cortado: el marketing sigue leyendo site.ts.",
      edit: "Editar",
      empty: "Aún no hay documentos en este tipo.",
      swapNote: "Ruta de cambio: corte un tipo a la vez con helpers getPublished* — vea preview/REUSE_PORT_v11.md. No elimine site.ts hasta cada corte. Mantenga las afirmaciones honestas (sin estrellas inventadas ni pueblos inventados). Las afirmaciones de confianza quedan en Ajustes, aparte del CMS Nosotros.",
      editStubNoteLive: "Guarda en el CMS en memoria. Los Publicados aparecen en {paths}. Mantenga citas y leyendas honestas — sin calificaciones inventadas.",
      editStubNoteAdmin: "Guarda en el almacén CMS en memoria. Este tipo es solo admin hasta su corte documentado; site.ts sigue siendo la fuente en vivo.",
      locked: "bloqueado",
      save: "Guardar",
      saved: "Contenido guardado (memoria)",
      saveFailed: "No se pudo guardar el contenido",
    },
    settings: {
      title: "Configuración",
      description:
        "Preferencias del espacio de trabajo y un mapa honesto de este prototipo: perfil, apariencia, postura de seguridad y límites de la plataforma.",
      meta: "Espacio de trabajo · preferencias",
      navAria: "Secciones de configuración",
      navProfile: "Perfil",
      navAppearance: "Apariencia",
      navTrust: "Afirmaciones de confianza",
      navSecurity: "Seguridad",
      navPlatform: "Plataforma",
      navAbout: "Acerca de",
      appearanceTitle: "Idioma y tema",
      appearanceBody:
        "Idioma y tema de este espacio de administración. Las preferencias permanecen en este dispositivo.",
      languageLabel: "Idioma de la interfaz",
      languageHelp:
        "Inglés o español colombiano formal (usted). Se aplica en todo el panel de administración.",
      themeLabel: "Tema de color",
      themeHelp:
        "Claro u oscuro — alineado con la artesanía oro–carbón–crema del sitio público.",
      themeLight: "Claro",
      themeDark: "Oscuro",
      securityTitle: "Acceso y autenticación",
      securityBadge: "Puerta provisional",
      securityBadgeCredentials: "Credenciales",
      authTitle: "Autenticación",
      authBody:
        "El acceso usa una contraseña compartida en {passwordEnv}. Un inicio de sesión exitoso establece una cookie httpOnly ({cookie}) por aproximadamente 12 horas. Esto no es autenticación multiusuario, MFA, endurecimiento CSRF, límite de tasa ni registro de auditoría.",
      authBodyCredentials:
        "Modo en vivo: credenciales contra la tabla {profiles}. Las sesiones se firman con HMAC mediante {secretEnv} (cookie {cookie}, ~12 horas). El rol proviene de profiles.role en cada solicitud — no de una afirmación falsificada del cliente. Aún no hay MFA, límite de tasa ni registro de auditoría completo.",
      authStatus: "Estado de autenticación",
      authModeLabel: "Modo en vivo",
      authModeStubHint: "Predeterminado — stub con cookie ADMIN_PASSWORD (sin AUTH_SECRET).",
      authModeCredentialsHint: "AUTH_SECRET está definido — correo/contraseña contra profiles.",
      passwordConfigured: "Configurada",
      passwordMissing: "Ausente",
      credentialsConfigured: "AUTH_SECRET definido",
      credentialsMissing: "Falta AUTH_SECRET",
      authSessionLabel: "Esta sesión",
      authSessionValue: "Rol {role} · {stub}",
      authSessionStub: "owner provisional",
      authSessionLive: "desde profiles",
      authFallbackLabel: "Contraseña provisional",
      authFallbackNote: "ADMIN_PASSWORD permanece en el entorno pero no se usa mientras AUTH_SECRET habilita el modo de credenciales. Quite AUTH_SECRET para volver al stub.",
      authLocalLabel: "Local",
      authProdLabel: "Producción",
      authRoadmapLabel: "Hoja de ruta",
      authLocal: "Desarrollo local — configure la variable en {envFile}.",
      authLocalCredentials: "Local — defina {secretEnv} en {envFile}, migre/siembre profiles e inicie sesión con owner@kabafence.example.",
      authProd:
        "Producción — configure la misma variable en el entorno del proyecto de Vercel.",
      authProdCredentials: "Producción — defina AUTH_SECRET (y DATABASE_URL si usa profiles en Postgres) en el entorno del alojamiento. Prefiera un secreto largo y aleatorio.",
      authReplace:
        "Active el modo de credenciales con AUTH_SECRET (profiles.role) o conserve el stub. Opcional después: Auth.js para OAuth. Contrato de sesión: getCurrentAdmin() → SessionAdmin.",
      authReplaceCredentials:
        "El modo de credenciales está activo. Opcional después: Auth.js para proveedores OAuth — conserve getCurrentAdmin() como resolver. Aún debe añadir MFA / límites de tasa antes de exposición pública.",
      authRotate:
        "La contraseña nunca se muestra ni se edita aquí. Rótela en el entorno del alojamiento y luego vuelva a desplegar o reiniciar.",
      authRotateCredentials:
        "Rote AUTH_SECRET y las contraseñas de profiles en el alojamiento / base de datos — nunca en esta interfaz. Vuelva a desplegar o reinicie tras rotar el secreto (las sesiones existentes quedan invalidadas).",
      rolesTitle: "Hoja de ruta de roles",
      rolesBody:
        "Los rangos (owner › editor › viewer) viven en {dal}. Toda Server Action debe comenzar con requireRole; las páginas usan requirePageRole. El modo stub siempre se resuelve como owner.",
      rolesBodyCredentials:
        "Los rangos (owner › editor › viewer) viven en {dal}. Las sesiones de credenciales cargan el rol desde profiles en cada solicitud. Las mutaciones deben llamar requireRole; las páginas usan requirePageRole.",
      rolesStubNote:
        "Hoy, cada inicio de sesión exitoso con ADMIN_PASSWORD se trata como owner. Editor y viewer aparecen aquí para que la interfaz de Seguridad coincida con el DAL — active AUTH_SECRET + profiles para roles reales.",
      rolesCredentialsNote:
        "El rol de esta sesión proviene de la fila en profiles. La semilla incluye un owner; agregue filas editor/viewer en Postgres (o memoria) según necesite. No hay cuentas simuladas más allá del owner de demostración.",
      rolesDocLabel: "ADMIN_ROLES_DOC",
      rolesDocHint:
        "Opcional: defina {env} en el entorno para mostrar una nota operativa aquí (solo documentación — no otorga un rol).",
      roleDesc: {
        owner: "Acceso total: usuarios, roles, facturación y acciones destructivas.",
        editor: "Crear y editar cotizaciones, facturas, pagos y contenido. Sin administración de usuarios.",
        viewer: "Vistas operativas de solo lectura. Sin cambios."
      },
      platformTitle: "Datos e integraciones",
      platformBody:
        "Cómo esta demostración conserva cotizaciones, facturas y pagos — y qué permanece intencionalmente sin conectar.",
      dataTitle: "Almacenamiento de datos",
      dataBadge: "En memoria",
      dataBadgeDb: "Postgres",
      dataBody:
        "Adaptador activo: {adapter} (variable {adapterEnv}, predeterminado memory). Cotizaciones, facturas, pagos, clientes y afirmaciones de confianza usan la capa de repositorios en src/lib/db/. Memory trae filas de demostración y se reinicia en arranques en frío. Postgres usa DATABASE_URL tras npm run db:migrate y db:seed. El {endpoint} público sigue aceptando envíos del formulario de marketing.",
      dataAdapterLabel: "Adaptador",
      dataUrlLabel: "DATABASE_URL",
      dataUrlSet: "Configurada",
      dataUrlMissing: "Sin definir",
      dataPostgresMissingUrl:
        "Adaptador Postgres seleccionado pero DATABASE_URL está vacía — defínala o vuelva a memory.",
      dataNext:
        "Activar: docker compose up -d (opcional), npm run db:migrate, npm run db:seed, luego KABA_DATA_ADAPTER=postgres + DATABASE_URL. Memory sigue siendo el predeterminado para que el build no necesite una base en vivo.",
      dataNotify:
        "La creación de cotizaciones usa persistir y luego notificar: primero se guarda la fila; {notify} envía vía Resend o SMTP si está configurado; si no, es un no-op honesto.",
      dataFilesLabel: "Esquema, semillas y repositorios",
      stripeTitle: "Pagos y Stripe",
      stripeBadge: "Sin conexión",
      stripeBadgeCheckout: "Checkout listo",
      stripeBadgeConnected: "Conectado",
      stripeBody:
        "Las claves de Stripe no están definidas. La página de Pagos sigue registrando filas manuales y puede marcar facturas como parciales o pagadas. No hay cobros en vivo sin claves.",
      stripeBodyCheckout:
        "STRIPE_SECRET_KEY está definida — el admin puede abrir Stripe Checkout para un anticipo de factura. Agregue STRIPE_WEBHOOK_SECRET para que las sesiones completadas escriban filas de pago (persistir y luego notificar).",
      stripeBodyConnected:
        "El secreto y el secreto del webhook están definidos. Checkout crea sesiones de anticipo; el webhook registra pagos vía el repositorio (idempotente por id de evento de Stripe). Use claves de prueba para demos — no hay cobros en vivo sin claves live.",
      stripePlan1: "Checkout de anticipo contra una factura (50 % del total, limitado al saldo)",
      stripePlan2: "El webhook escribe primero la fila de pago (idempotente por id de evento) y luego actualiza el estado de la factura",
      stripeEnv: "Variables de entorno",
      stripeKeySet: "Definida",
      stripeKeyMissing: "Sin definir",
      stripeRoutes:
        "Rutas: {checkout} (admin) · /api/pay/[token]/checkout (público) · {webhook} (Stripe → app). Migraciones: 0003_stripe + 0004_pay_token.",
      mailTitle: "Notificaciones por correo",
      mailBadge: "Sin configurar",
      mailBadgeResend: "Resend",
      mailBadgeSmtp: "SMTP",
      mailBody:
        "Las claves de correo no están definidas. notifyQuoteCreated y notifyPaymentReceived permanecen como no-ops honestos — las cotizaciones y pagos se persisten primero.",
      mailBodyResend:
        "RESEND_API_KEY + MAIL_FROM están definidas. Las alertas al propietario y los avisos de pago se envían vía Resend después de guardar la fila.",
      mailBodySmtp:
        "SMTP_HOST + MAIL_FROM están definidas. Las alertas y avisos de pago se envían vía SMTP después de guardar la fila. Resend tiene prioridad si ambos están configurados.",
      mailPlan1: "Crear cotización → alerta al propietario (MAIL_TO_OWNERS o correo del sitio)",
      mailPlan2: "Pago registrado → aviso de recibo al propietario y al cliente (persistir y luego notificar)",
      mailEnv: "Variables de entorno",
      mailKeySet: "Definida",
      mailKeyMissing: "Sin definir",
      mailRoutes:
        "Ganchos: {quoteNotify} · {paymentNotify}. Prefiera RESEND_API_KEY; si no, SMTP_HOST (+ SMTP_PORT/USER/PASS).",
      aboutTitle: "Acerca de este admin",
      aboutBody:
        "Herramientas operativas de bajo costo y notas de diseño para demos — sin analítica ni mensajería de pago.",
      aboutVersion: "Prototipo {version}",
      aboutCredit: "Sitio elaborado por",
      aboutCreditName: "Datelica",
      opsTitle: "Herramientas operativas",
      opsBody: "Incluidas sin Stripe, bases de datos ni APIs de pago:",
      opsPipeline: "Pipeline — kanban arrastrable sobre estados de cotización",
      opsPricebook: "Lista de precios — tarifas en localStorage y totales de estimado",
      opsTemplates: "Plantillas — campos SMS, correo y nota; copiar al portapapeles",
      opsQuick:
        "Acciones rápidas en detalle de cotización y factura (llamar, correo, copiar, imprimir)",
      craftTitle: "Descubrimiento y diseño",
      craftBody:
        "{robots} impide {admin} y {api}. El layout del admin también define {noindex}. No enlace este admin desde la interfaz pública del sitio.",
      craftPalette: "Paleta de comandos",
      craftShortcuts: "Hoja de atajos",
      craftCharts: "Los gráficos son SVG y CSS puros — sin Chart.js ni analítica de pago",
      craftLazy: "La paleta y los atajos se cargan con importación dinámica",
      trustBadge: "Respaldo local",
      trustBadgeServer: "Servidor",
      trustTitle: "Acerca de su negocio",
      trustBody:
        "Estas opciones se mostrarán como insignias de confianza cuando un almacén durable alimente el sitio público. Permanecen desactivadas aquí hasta que usted las confirme: no afirmaremos algo sobre el negocio que usted no nos haya dicho.",
      trustFreeEstimates: "Ofrecemos estimados gratis",
      trustFreeEstimatesHint:
        "Confirme solo si el estimado es realmente gratis: sin monto mínimo ni cargo de desplazamiento.",
      trustLocallyOwned: "Somos de propiedad local",
      trustLocallyOwnedHint:
        "De propiedad y operación en el área de Raleigh / Angier, no una sucursal ni una franquicia.",
      trustPublicNoteLabel: "Sitio público",
      trustPublicNote:
        "La barra de confianza del marketing en vivo aún proviene de site.ts hasta que conecte las insignias a getTrustClaimsForPublic(). Los cambios se guardan en el adaptador del servidor (memory o site_settings de Postgres); localStorage solo es respaldo si la API no está disponible.",
      trustSave: "Guardar afirmaciones",
      trustSaving: "Guardando…",
      trustSavedTitle: "Afirmaciones guardadas",
      trustSavedDesc: "Almacenado en este dispositivo hasta que una base de datos reemplace localStorage.",
      trustSavedDescServer: "Guardado en el servidor ({adapter}). Lector público: getTrustClaimsForPublic().",
      trustSavedDescLocal: "Falló el guardado en el servidor — solo en este dispositivo (respaldo localStorage).",
      trustSavedInline: "Guardado en este dispositivo",
      trustSavedInlineServer: "Guardado en el servidor",
      trustStorageHint: "Se guarda solo en localStorage de este navegador.",
      trustStorageHintServer: "Se guarda vía /api/admin/trust-claims en el adaptador de datos activo."
    }
  },
  login: {
    metaTitle: "Acceso admin",
    brand: "Kaba Fence Admin",
    headline: "Operaciones de campo, con elegancia.",
    subhead:
      "Una base pulida para cotizaciones, facturas y pagos: lista para demos de agencia y honesta sobre la autenticación provisional.",
    h1: "Cotización → factura → pago",
    h1body: "Pipeline, líneas de tiempo y libro provisional — listo para una base de datos real.",
    h2: "Herramientas para el campo",
    h2body: "Pipeline kanban, lista de precios local y plantillas de seguimiento — sin APIs de pago.",
    h3: "Diseño de agencia",
    h3body: "Oro · carbón · crema, Playfair/Inter, claro/oscuro, paleta ⌘K.",
    authStrong: "Autenticación provisional — no apta para producción.",
    authStrongCredentials: "Modo de credenciales — profiles.role.",
    authBody:
      "Solo cookie de contraseña compartida. Reemplácela antes de manejar datos reales de clientes.",
    authBodyCredentials:
      "Correo y contraseña contra perfiles del personal. El rol se carga desde la base de datos en cada solicitud.",
    brandShort: "Kaba Fence",
    signInTitle: "Acceso de administrador",
    signInMobileSub: "Base de cotizaciones, facturas y pagos.",
    emailLabel: "Correo electrónico",
    signInDesktopSub: "Ingrese la contraseña provisional compartida para continuar.",
    backSite: "← Volver al sitio público",
    passwordLabel: "Contraseña de administrador",
    show: "Mostrar",
    hide: "Ocultar",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión…",
    stubNote:
      "Solo autenticación provisional — la sesión por cookie dura ~12 horas. No es adecuada como única protección de datos personales en producción.",
    credentialsNote:
      "Sesión de credenciales (~12 horas). Owner de demostración: owner@kabafence.example / change-me-owner. Rótelos antes de producción.",
    notConfiguredTitle: "Contraseña de administrador no configurada",
    notConfiguredBody:
      "Configure {passwordEnv} en {envFile} (o en el entorno del alojamiento) y reinicie el servidor. Esta puerta es temporal: reemplácela con autenticación real antes de cualquier uso en producción.",
    notConfiguredCredentialsTitle: "Modo de credenciales no listo",
    notConfiguredCredentialsBody:
      "Defina {secretEnv} en {envFile} (o en el entorno del alojamiento) y reinicie. Siembre un perfil owner (npm run db:seed) o use el owner de demostración en memoria.",
    loginFailed: "No se pudo iniciar sesión.",
    networkError: "Error de red. Inténtelo de nuevo."
  },
  quotes: {
    goneQuiet: "Sin respuesta",
    goneQuietIntro:
      "Sin movimiento por {days}+ días mientras sigue nueva, contactada o agendada.",
    goneQuietCount: "{count} cotización en silencio",
    goneQuietCount_plural: "{count} cotizaciones en silencio",
    quietForDays: "En silencio desde hace {count} día",
    quietForDays_plural: "En silencio desde hace {count} días",
    searchLabel: "Buscar cotizaciones",
    searchPlaceholder: "Buscar nombre, teléfono, servicio…",
    exportTitle: "Descargar cotizaciones filtradas en CSV",
    allCount: "Todas ({count})",
    bulkStatus: "Cambio masivo de estado",
    applyStatus: "Aplicar estado",
    emptyTitle: "Aún no hay cotizaciones",
    emptyDesc:
      "Los envíos desde /quote aparecerán aquí. Esta demo usa datos en memoria: se reinician en arranques en frío hasta conectar una base de datos.",
    noMatchesDesc: "Pruebe otra búsqueda o limpie el filtro de estado.",
    selectAll: "Seleccionar todas las filtradas",
    selectOne: "Seleccionar {name}",
    statusFor: "Estado de {name}",
    colReceived: "Recibida",
    colContact: "Contacto",
    colService: "Servicio",
    colLocation: "Ubicación",
    colStatus: "Estado",
    markLostTitle: "¿Marcar como perdida?",
    markLostDesc:
      "Esto marcará {count} cotización como perdida. Puede cambiar el estado después.",
    markLostDesc_plural:
      "Esto marcará {count} cotizaciones como perdidas. Puede cambiar el estado después.",
    markLostConfirm: "Marcar perdida",
    csvHeaders: "Recibida,Nombre,Teléfono,Correo,Servicio,Dirección,Estado,Origen"
  },
  pipeline: {
    hintNew: "Leads nuevos",
    hintContacted: "Contacto iniciado",
    hintScheduled: "Visitas al sitio",
    hintWon: "Trabajos cerrados",
    hintLost: "Archivadas",
    dropHere: "Suelte aquí",
    moveFailed: "No se pudo mover",
    movedArrow: "Movida → {status}",
    emptyTitle: "El pipeline está vacío",
    emptyDesc:
      "Cuando lleguen cotizaciones del formulario público, arrastre tarjetas entre etapas — o avance el estado desde el detalle.",
    footer:
      "Arrastre tarjetas entre columnas o use los botones → rápidos. Los cambios se guardan en memoria."
  },
  invoices: {
    createFrom: "Crear borrador desde cotización",
    pickQuote: "Elija una cotización…",
    pickQuoteFirst: "Primero elija una cotización.",
    createDraft: "Crear borrador",
    createFailed: "No se pudo crear.",
    searchPlaceholder: "Buscar #, cliente…",
    exportTitle: "Descargar facturas filtradas en CSV",
    emptyTitle: "Aún no hay facturas",
    emptyDesc:
      "Cree un borrador desde una cotización arriba. Los montos son datos sintéticos de demostración hasta conectar el estimado.",
    colNumber: "Número",
    colCustomer: "Cliente",
    colTotal: "Total",
    colPaid: "Pagado",
    colBalance: "Saldo",
    colStatus: "Estado",
    csvHeaders: "Número,Cliente,Correo,Dirección,Total,Pagado,Saldo,Estado,Creada"
  },
  payments: {
    recordTitle: "Registrar pago",
    invoice: "Factura",
    selectInvoice: "Seleccione una factura.",
    amount: "Monto",
    amountInvalid: "Ingrese un monto válido mayor que cero.",
    method: "Método",
    reference: "Referencia",
    referencePh: "Cheque # / últimos 4 / memo",
    notes: "Notas",
    notesPh: "Opcional",
    fixFields: "Corrija los campos resaltados.",
    recordFailed: "No se pudo registrar.",
    recordedOk: "Pago registrado en el libro.",
    recordPayment: "Registrar pago",
    collectDeposit: "Cobrar anticipo (Stripe)",
    checkoutFailed: "No se pudo iniciar Stripe Checkout.",
    stripeNotReady: "Stripe no está conectado — defina STRIPE_SECRET_KEY primero.",
    stripeNotConnectedTitle: "Stripe sin conexión.",
    stripeNotConnectedBody:
      "Este formulario solo escribe una fila en el libro. La captura con tarjeta requiere claves de Stripe — vea",
    stripeConnectedTitle: "Stripe Checkout disponible.",
    stripeConnectedBody:
      "Use “Cobrar anticipo” para abrir Checkout en esta factura, o registre un pago manual. Estado:",
    emptyTitle: "No hay pagos registrados",
    emptyDesc:
      "Registre un pago manual o cobre un anticipo con Stripe cuando haya claves.",
    colInvoice: "Factura",
    colCustomer: "Cliente",
    colAmount: "Monto",
    colMethod: "Método",
    colStatus: "Estado",
    colDate: "Fecha"
  },
  notifications: {
    label: "Notificaciones",
    unread: "Notificaciones, {count} sin leer",
    markAll: "Marcar todas como leídas",
    stubFooter:
      "Feed provisional — sin push, correo ni tiempo real aún. Solo para la interfaz.",
    n1title: "Cotización nueva · Jordan Miles",
    n1body: "Solicitud de cerca de madera desde Angier — requiere primer contacto.",
    n2title: "Visita al sitio mañana",
    n2body: "Chris Nguyen · privacidad en vinilo · Fuquay-Varina.",
    n3title: "Saldo de factura abierto",
    n3body:
      "La cartera demo aún tiene saldo abierto — registre un pago provisional.",
    time26h: "hace 26 h",
    time2d: "hace 2 d",
    time3d: "hace 3 d"
  },
  cmd: {
    groupNavigate: "Navegación",
    placeholder: "Ir a página, cotización o acción…",
    close: "Cerrar paleta de comandos",
    label: "Paleta de comandos",
    quote: "Cotización",
    action: "Acción",
    shortcuts: "Atajos de teclado",
    cheatSheet: "Guía rápida",
    empty: "Sin coincidencias — pruebe un nombre, servicio o página.",
    go: "Ir",
    footerNav: "↑↓ navegar · ↵ abrir",
    footerSearch: "Las cotizaciones se buscan al escribir"
  },
  shortcuts: {
    title: "Atajos de teclado",
    sub: "Navegación ágil — sin extensiones.",
    close: "Cerrar atajos",
    tip: "Consejo: abra la paleta y escriba el nombre de un cliente para ir a su cotización.",
    a1: "Abrir paleta de comandos",
    a2: "Abrir paleta de comandos (Windows/Linux)",
    a3: "Mostrar esta hoja de atajos",
    a4: "Cerrar paleta / hoja",
    a5: "Mover selección en la paleta",
    a6: "Abrir el elemento seleccionado"
  },
  profile: {
    title: "Perfil del operador",
    badge: "Solo esta sesión",
    body: "Datos de visualización del operador que inició sesión. Los cambios permanecen en esta sesión del navegador — reemplácelos con registros de usuario reales cuando llegue Auth.js o Clerk.",
    displayName: "Nombre para mostrar",
    displayNameHelp: "Se muestra en la interfaz de sesión de este operador.",
    roleLabel: "Etiqueta de rol",
    roleHelp: "Solo informativa — aún no hay motor de permisos.",
    email: "Correo electrónico",
    emailHelp: "Para visualización y acciones de copia; no verificado.",
    phone: "Teléfono",
    phoneHelp: "Se prefieren 10 dígitos al estilo EE. UU. para llamadas de campo.",
    errName: "Ingrese un nombre para mostrar (al menos 2 caracteres).",
    errEmail: "Ingrese una dirección de correo válida.",
    errPhone: "Ingrese un teléfono con al menos 10 dígitos.",
    errRole: "Ingrese una etiqueta de rol.",
    fixFields: "Corrija los campos resaltados.",
    savedTitle: "Perfil guardado",
    savedDesc:
      "Conservado solo para esta sesión — aún no se escribe en una base de datos.",
    savedInline: "Guardado para esta sesión",
    save: "Guardar perfil",
    saving: "Guardando…",
    noPassword:
      "El cambio de contraseña se hace en el entorno del alojamiento — no en este formulario.",
    avatarLabel: "Operador"
  },
  templates: {
    all: "Todas",
    sms: "SMS",
    email: "Correo",
    note: "Interna",
    mergeTitle: "Campos dinámicos",
    mergeHint:
      "Complete una vez — la vista previa se actualiza al instante. Sin API de correo/SMS.",
    name: "Nombre",
    service: "Servicio",
    address: "Dirección",
    when: "Cuándo",
    amount: "Monto",
    invoice: "Factura #",
    preview: "Vista previa",
    copy: "Copiar al portapapeles",
    copied: "Plantilla copiada",
    select: "Seleccione una plantilla."
  },
  pricebook: {
    estimate: "Estimado rápido",
    estimateHint:
      "Defina cantidades — los totales permanecen en este dispositivo (localStorage).",
    qty: "Cant.",
    unit: "Unidad",
    lineTotal: "Línea",
    subtotal: "Subtotal",
    addCustom: "Agregar tarifa personalizada",
    namePh: "Nombre",
    categoryPh: "Categoría",
    unitPh: "Unidad (ml, und…)",
    unitPricePh: "Precio und. $",
    add: "Agregar",
    addToBook: "Agregar a la lista",
    reset: "Restablecer semilla",
    resetTitle: "¿Restablecer lista de precios?",
    resetDesc:
      "Esto elimina las tarifas personalizadas y restaura el libro de demostración en este navegador.",
    resetConfirm: "Restablecer",
    clearQty: "Limpiar cant.",
    resetDefaults: "Restablecer valores",
    saved: "Lista de precios guardada localmente",
    resetDone: "Lista de precios restablecida",
    emptyTitle: "Sin tarifas",
    emptyDesc: "Agregue una tarifa personalizada abajo, o restablezca el libro semilla.",
    emptyCategory: "Sin partidas en esta categoría",
    remove: "Eliminar",
    category: "Categoría",
    colItem: "Partida",
    colUnit: "Unidad",
    colRate: "Tarifa",
    colQty: "Cant.",
    colLine: "Línea",
    saveLocalFailed: "No se pudo guardar localmente",
    namePriceRequired: "Indique el nombre y el precio unitario",
    lineAdded: "Partida agregada",
    restoredDefaults: "Valores restablecidos",
    qtyFor: "Cantidad de {name}"
  },
  reports: {
    range: "Rango de fechas",
    d7: "7 días",
    d30: "30 días",
    d90: "90 días",
    allTime: "Todo el tiempo",
    allServices: "Todos los servicios",
    quotes: "Cotizaciones",
    wonRate: "Tasa de cierre",
    openAr: "Cartera abierta (demo)",
    collectedStub: "Recaudado (provisional)",
    open: "Abiertas",
    paid: "Pagadas",
    other: "Otras",
    byStatus: "Cotizaciones por estado",
    invoiceMix: "Composición de facturas",
    funnel: "Embudo de conversión"
  },
  detail: {
    backQuotes: "Volver a cotizaciones",
    backInvoices: "Volver a facturas",
    notes: "Notas",
    description: "Descripción",
    customer: "Cliente",
    service: "Servicio",
    address: "Dirección",
    source: "Origen",
    received: "Recibida",
    updated: "Actualizada",
    call: "Llamar",
    email: "Correo",
    print: "Imprimir",
    printInvoice: "Imprimir factura",
    status: "Estado",
    progress: "Progreso",
    request: "Solicitud",
    prefer: "Preferencia",
    phone: "Teléfono",
    quoteStatus: "Estado de la cotización",
    internalNotes: "Notas internas",
    notesPlaceholder: "Notas de llamada, acceso al sitio, restricciones de HOA…",
    notesSaved: "Notas guardadas",
    saveFailed: "No se pudo guardar",
    saveNotes: "Guardar notas",
    viewInvoice: "Ver factura",
    createInvoice: "Crear borrador de factura",
    invoiceCreated: "Factura creada",
    createInvoiceFailed: "No se pudo crear la factura",
    followUpTemplates: "Plantillas de seguimiento →",
    pricebookLink: "Lista de precios →",
    nextStepTitle: "Siguiente paso:",
    nextStepBody:
      "tras la visita al sitio, cree una factura de demostración desde esta cotización y registre pagos en el detalle de la factura. Los montos siguen siendo sintéticos hasta conectar Stripe y la base de datos.",
    balanceDueTitle: "Saldo por cobrar:",
    balanceDueBody:
      "Registre un pago o ajuste el estado. Cobre un anticipo con Stripe cuando haya claves.",
    sourceQuote: "Cotización de origen",
    lineItems: "Partidas",
    qty: "Cant.",
    unitPrice: "Unidad",
    amount: "Monto",
    subtotal: "Subtotal",
    tax: "Impuesto",
    total: "Total",
    balance: "Saldo",
    paid: "Pagado",
    payments: "Pagos",
    noPayments: "Aún no hay pagos en esta factura.",
    voidTitle: "¿Anular esta factura?",
    voidDesc:
      "Las facturas anuladas permanecen en el libro para auditoría, pero no deben cobrar pago. En esta demo puede cambiar el estado de nuevo.",
    voidConfirm: "Anular factura",
    invoiceArrow: "Factura → {status}",
    markContacted: "Marcar contactada",
    scheduleVisit: "Agendar visita",
    markWon: "Marcar ganada",
    markLost: "Marcar perdida",
    sendInvoice: "Marcar enviada",
    markPartial: "Marcar parcial",
    markPaid: "Marcar pagada",
    voidAction: "Anular",
    relatedQuote: "Cotización relacionada",
    created: "Creada",
    noneRecorded: "Aún no hay registros.",
    recordFirstPayment: "Registrar primer pago →",
    collectDeposit: "Cobrar anticipo (Stripe)",
    stripeNotConnected: "Stripe sin conexión — defina las claves en Configuración → Plataforma para abrir Checkout.",
    copyPayLink: "Copiar enlace de pago",
    sharePayLink: "Compartir enlace de pago",
    payLinkShareTitle: "Pague su factura",
    payLinkShareText: "Pague el anticipo de la factura {number}",
    payLinkShared: "Enlace de pago compartido",
    payLinkHint: "Enlace de pago del cliente (sin inicio de sesión de administración):",
    billTo: "Facturar a",
    descriptionCol: "Descripción"
  }
} as const satisfies DictNode;

export default es;
