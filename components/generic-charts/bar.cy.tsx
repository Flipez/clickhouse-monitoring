import { BarChart } from './bar'

describe('<BarChart />', () => {
  const data = [
    {
      date: '2025-01-01',
      A: 1000,
      B: 2000,
      C: 501,
      readable_A: 'one hundred',
    },
    {
      date: '2025-02-01',
      A: 6411,
      B: 1241,
      C: 8210,
      readable_A: 'six hundred and forty one',
    },
    {
      date: '2025-03-01',
      A: 2314,
      B: 121,
      C: 1249,
      readable_A: 'two hundred and thirty one',
    },
  ]

  it('renders default', () => {
    cy.mount(<BarChart data={data} categories={['A', 'B', 'C']} index="date" />)
    cy.screenshot()

    // Render as svg
    cy.get('svg:first').as('chart').should('be.visible')

    // Contains legend
    cy.get('.recharts-legend-wrapper').as('legend').should('be.visible')
    cy.get('@legend').contains('A')
    cy.get('@legend').contains('B')
    cy.get('@legend').contains('C')

    // Contains date
    cy.get('@chart').should('contain', '2025-01-01')

    // Hover to show tooltip
    // Size: 500x500
    cy.get('@chart').trigger('mouseover')

    // Display tooltip of the 2nd data
    cy.get('div').should('contain', '2025-02-01')
  })

  it('renders with readableColumn="readable_A"', () => {
    cy.mount(
      <BarChart
        data={data}
        categories={['A', 'B', 'C']}
        index="date"
        readableColumn="readable_A"
      />
    )

    // Render as svg
    cy.get('svg:first').as('chart').should('be.visible')

    // Display data from readable_A instead of A
    cy.get('@chart').should('contain', 'one hundred')
    cy.get('@chart').should('contain', 'six hundred and forty one')
  })

  it('renders showLegend={false}', () => {
    cy.mount(
      <BarChart
        data={data}
        categories={['A', 'B', 'C']}
        index="date"
        showLegend={false}
      />
    )

    // Render as svg
    cy.get('svg:first').as('chart').should('be.visible')

    // No legend
    cy.get('.recharts-legend-wrapper').should('not.exist')
  })

  it('renders tickFormatter={(value) => value.slice(0, 4)}', () => {
    cy.mount(
      <BarChart
        data={data}
        categories={['A', 'B', 'C']}
        index="date"
        tickFormatter={(value) => '--' + value.slice(0, 4)}
      />
    )

    // Render as svg
    cy.get('svg:first').as('chart').should('be.visible')

    // Display tooltip of the 2nd data
    cy.get('.recharts-cartesian-axis-ticks').should('contain', '--2025')
  })

  it('renders with stack', () => {
    cy.mount(
      <BarChart data={data} categories={['A', 'B', 'C']} index="date" stack />
    )

    // Render as svg
    cy.get('svg:first').as('chart').should('be.visible')
  })
})
