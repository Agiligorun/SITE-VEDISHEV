import React, { Fragment } from 'react'

import {
  AboutProfileBlock,
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

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block {...block} siteSettings={siteSettings} sourcePage={sourcePage} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
