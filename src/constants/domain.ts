const domain = {
  real: {
    api: 'https://api.xx.com',
  },
  pre: {
    api: 'https://api-pre.xx.com',
  },
  stable: {
    api: 'https://api-stable.xx.com',
  },
  dev: {
    api: 'https://api-dev.xx.com',
  },
}

export type IPrefix = keyof typeof domain.real

export default domain
