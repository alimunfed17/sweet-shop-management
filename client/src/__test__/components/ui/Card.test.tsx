import { render, screen } from '@testing-library/react'
import Card from "@/components/ui/Card";

describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render children', () => {
      render(<Card>Card Content</Card>)
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    it('should have default styling', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-md')
    })
  })

  describe('Hover Effect', () => {
    it('should not have hover effect by default', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveClass('hover:shadow-xl')
    })

    it('should apply hover effect when hover prop is true', () => {
      const { container } = render(<Card hover>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('hover:shadow-xl', 'hover:-translate-y-1')
    })
  })

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-card">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('custom-card')
    })

    it('should accept and apply other HTML attributes', () => {
      const { container } = render(
        <Card data-testid="test-card" aria-label="Test Card">
          Content
        </Card>
      )
      const card = container.firstChild as HTMLElement
      expect(card).toHaveAttribute('data-testid', 'test-card')
      expect(card).toHaveAttribute('aria-label', 'Test Card')
    })
  })

  describe('Content', () => {
    it('should render multiple children', () => {
      render(
        <Card>
          <h1>Title</h1>
          <p>Description</p>
        </Card>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('should render complex nested content', () => {
      render(
        <Card>
          <div>
            <h2>Nested Title</h2>
            <div>
              <p>Nested Paragraph</p>
            </div>
          </div>
        </Card>
      )
      expect(screen.getByText('Nested Title')).toBeInTheDocument()
      expect(screen.getByText('Nested Paragraph')).toBeInTheDocument()
    })
  })
})