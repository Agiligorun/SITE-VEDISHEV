import React, { Fragment } from 'react'

import {
  AboutProfileBlock,
  HomeAboutPublicationsZone,
  ArticlesGridBlock,
  ConsultationCtaBlock,
  ContactsBlock,
  FAQBlock,
  HeroBlock,
  PracticeGridBlock,
  PublicationsListBlock,
  TrustStripBlock,
} from '@/blocks/Vedishev/components'

const blockComponents = {
  aboutProfile: AboutProfileBlock,
  articlesGrid: ArticlesGridBlock,
  consultationCta: ConsultationCtaBlock,
  contactsBlock: ContactsBlock,
  faqBlock: FAQBlock,
  legalHero: HeroBlock,
  practiceGrid: PracticeGridBlock,
  publicationsList: PublicationsListBlock,
  trustStrip: TrustStripBlock,
}

export const RenderBlocks: React.FC<{
  blocks: any[]
  siteSettings?: any
  sourcePage: string
}> = (props) => {
  const { blocks, siteSettings, sourcePage } = props
  const isHomePage = sourcePage === '/home' || sourcePage === '/'

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    const filteredBlocks = isHomePage
      ? blocks.filter((block) => !['faqBlock', 'consultationCta', 'contactsBlock'].includes(block?.blockType))
      : blocks

    return (
      <Fragment>
        {filteredBlocks.map((block, index) => {
          const { blockType } = block
          const nextBlock = filteredBlocks[index + 1]

          if (blockType === 'publicationsList' && filteredBlocks[index - 1]?.blockType === 'aboutProfile') {
            return null
          }

          if (isHomePage && blockType === 'aboutProfile' && nextBlock?.blockType === 'publicationsList') {
            return (
              <HomeAboutPublicationsZone
                aboutBlock={block}
                key={`${blockType}-${index}`}
                publicationsBlock={nextBlock}
                siteSettings={siteSettings}
              />
            )
          }

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              return <Block {...block} key={`${blockType}-${index}`} siteSettings={siteSettings} sourcePage={sourcePage} />
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
