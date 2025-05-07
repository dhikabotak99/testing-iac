export default defineAppConfig({
  title: 'Tairo',
  error: {
    logo: {
      component: 'TairoLogo',
      props: {
        class: 'text-primary-500 mx-auto h-40 p-6',
      },
    },
  },
  panels: [],
  collapse: {
    navigation: {
      enabled: true,
      header: {
        component: '',
      },
      footer: {
        component: '',
      },
      items: [],
    },
    circularMenu: {
      enabled: true,
      tools: [],
    },
    toolbar: {
      enabled: true,
      showTitle: false,
      showNavBurger: false,
      tools: [],
    },
  },
})
