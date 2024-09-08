import { MenuDropdownStyle } from './menu-dropdown-style'
import { type MenuItem } from './types'

const items: MenuItem[] = [
  {
    title: 'Item 1',
    href: '/item-1',
  },
  {
    title: 'Item 2',
    href: '/item-2',
    description: 'Item 2 description',
  },
]

const itemsWithChild: MenuItem[] = [
  {
    title: 'Item 1',
    href: '/item-1',
  },
  {
    title: 'Item 2',
    href: '/item-2',
    description: 'Item 2 description',
    items: [
      {
        title: 'Item 2.1',
        href: '/item-2-1',
      },
      {
        title: 'Item 2.2',
        href: '/item-2-2',
      },
    ],
  },
]

describe('<MenuDropdownStyle />', () => {
  it('renders single items', () => {
    cy.mount(<MenuDropdownStyle items={items} />)

    // Trigger opens the menu
    cy.get('button').should('be.visible').click()

    cy.contains('Item 1').should('be.visible')
    cy.contains('Item 2').should('be.visible')
  })

  it('renders with sub-items', () => {
    cy.mount(<MenuDropdownStyle items={itemsWithChild} />)

    // Trigger opens the menu
    cy.get('button').should('be.visible').click()

    // <a>Item 1</a>
    // <button>Item 2</button>
    cy.get('a').should('have.length', 1)

    // Hover over Item 2
    // <a>Item 2.1</a>
    // <a>Item 2.2</a>
    cy.contains('Item 2').click()
    cy.contains('Item 2.1').should('be.visible')
    cy.contains('Item 2.2').should('be.visible')
  })
})
