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
      "Acceso por contraseña y cookie solo para el prototipo. Reemplácela con autenticación real (Auth.js/Clerk + roles) antes de manejar datos de clientes en producción.",
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
        "La puerta provisional ADMIN_PASSWORD está configurada, pero no es autenticación multiusuario. Reemplácela con Auth.js/Clerk (o equivalente) + roles antes de datos reales de clientes — vea Configuración → Seguridad y src/lib/admin/dal.ts.",
      blockerAuthMissing:
        "ADMIN_PASSWORD no está configurada. Defínala en local y en Vercel; luego reemplace la puerta provisional antes de producción.",
      blockerDb: "Base de datos durable",
      blockerDbDetail:
        "Cotizaciones, facturas y pagos están en memoria. Los arranques en frío reinician la lista. Persista antes de confiar en leads de producción (persistir y luego notificar).",
      blockerStripe: "Stripe (o riel de pagos)",
      blockerStripeDetail:
        "La página de Pagos es solo un libro provisional: aún no hay Checkout, webhooks ni alcance PCI.",
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
        "Libro provisional vinculado a facturas. Sin Stripe, ACH ni captura de tarjeta: solo registro para la base de la interfaz."
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
      authTitle: "Autenticación",
      authBody:
        "El acceso usa una contraseña compartida en {passwordEnv}. Un inicio de sesión exitoso establece una cookie httpOnly ({cookie}) por aproximadamente 12 horas. Esto no es autenticación multiusuario, MFA, endurecimiento CSRF, límite de tasa ni registro de auditoría.",
      authStatus: "Estado de la contraseña",
      passwordConfigured: "Configurada",
      passwordMissing: "Ausente",
      authLocalLabel: "Local",
      authProdLabel: "Producción",
      authRoadmapLabel: "Hoja de ruta",
      authLocal: "Desarrollo local — configure la variable en {envFile}.",
      authProd:
        "Producción — configure la misma variable en el entorno del proyecto de Vercel.",
      authReplace:
        "Reemplácela con Auth.js, Clerk o equivalente — más roles — antes de manejar datos reales de clientes.",
      authRotate:
        "La contraseña nunca se muestra ni se edita aquí. Rótela en el entorno del alojamiento y luego vuelva a desplegar o reiniciar.",
      platformTitle: "Datos e integraciones",
      platformBody:
        "Cómo esta demostración conserva cotizaciones, facturas y pagos — y qué permanece intencionalmente sin conectar.",
      dataTitle: "Almacenamiento de datos",
      dataBadge: "En memoria",
      dataBody:
        "Cotizaciones, facturas y pagos viven en la memoria del proceso con filas de demostración. En Vercel serverless, un arranque en frío reinicia la lista. El {endpoint} público sigue aceptando envíos del formulario de marketing en la instancia activa que los recibe.",
      dataNext: "Siguiente: Postgres o SQLite (Drizzle o Prisma) con migraciones.",
      dataFilesLabel: "Módulos de almacenamiento",
      stripeTitle: "Pagos y Stripe",
      stripeBadge: "Sin conexión",
      stripeBody:
        "Stripe no está integrado. La página de Pagos registra filas provisionales y puede marcar facturas como parciales o pagadas. Aún no hay Checkout, Payment Intents, Connect, webhooks ni alcance PCI en esta aplicación.",
      stripePlan1: "Planificado — cobro de anticipo y saldo contra facturas",
      stripePlan2: "Planificado — estado por webhooks, recibos y conciliación",
      stripeEnv: "Variables de entorno (sin uso)",
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
      trustBadge: "Provisional local",
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
        "La barra de confianza del marketing en vivo aún proviene de site.ts. Estos interruptores se guardan en localStorage (kaba-admin-trust-claims-v1) con una forma de API lista para una fila de base de datos: getTrustClaimsForPublic() es el punto de intercambio.",
      trustSave: "Guardar afirmaciones",
      trustSaving: "Guardando…",
      trustSavedTitle: "Afirmaciones guardadas",
      trustSavedDesc: "Almacenadas en este dispositivo hasta que una base de datos reemplace localStorage.",
      trustSavedInline: "Guardado en este dispositivo",
      trustStorageHint: "Se guarda solo en localStorage de este navegador."
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
    authBody:
      "Solo cookie de contraseña compartida. Reemplácela antes de manejar datos reales de clientes.",
    brandShort: "Kaba Fence",
    signInTitle: "Acceso de administrador",
    signInMobileSub: "Base de cotizaciones, facturas y pagos.",
    signInDesktopSub: "Ingrese la contraseña provisional compartida para continuar.",
    backSite: "← Volver al sitio público",
    passwordLabel: "Contraseña de administrador",
    show: "Mostrar",
    hide: "Ocultar",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión…",
    stubNote:
      "Solo autenticación provisional — la sesión por cookie dura ~12 horas. No es adecuada como única protección de datos personales en producción.",
    notConfiguredTitle: "Contraseña de administrador no configurada",
    notConfiguredBody:
      "Configure {passwordEnv} en {envFile} (o en el entorno del alojamiento) y reinicie el servidor. Esta puerta es temporal: reemplácela con autenticación real antes de cualquier uso en producción.",
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
    recordTitle: "Registrar pago (provisional)",
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
    recordedOk: "Pago registrado (demo provisional — sin Stripe).",
    recordPayment: "Registrar pago",
    emptyTitle: "No hay pagos registrados",
    emptyDesc:
      "Use el formulario provisional arriba para asociar un pago de demostración a una factura.",
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
      "Registre un pago provisional o ajuste el estado — Stripe Checkout aún no está conectado.",
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
    billTo: "Facturar a",
    descriptionCol: "Descripción"
  }
} as const satisfies DictNode;

export default es;
