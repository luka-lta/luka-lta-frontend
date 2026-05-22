import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

const BASE_URL = 'https://luka-lta.dev'

interface SEOProps {
  title: string
  description?: string
  canonicalPath?: string
  noIndex?: boolean
}

export default function SEO({ title, description, canonicalPath = '/', noIndex = false }: SEOProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language.slice(0, 2)
  const fullTitle = `${title} | luka-lta.dev`
  const canonical = `${BASE_URL}${canonicalPath}`

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="de" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:url" content={canonical} />
      {description && <meta property="og:description" content={description} />}
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
    </Helmet>
  )
}
