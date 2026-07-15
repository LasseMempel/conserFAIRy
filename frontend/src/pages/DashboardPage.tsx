import { DataCard } from "@/components/data-card"

export function DashboardPage() {
  const cardData = [
    {
      title: "Card 1",
      description: "First card content",
      content: <p>Card content goes here.</p>,
    },
    {
      title: "Card 2",
      description: "Second card content",
      content: <p>Card content goes here.</p>,
    },
    {
      title: "Card 3",
      description: "Third card content",
      content: <p>Card content goes here.</p>,
    },
  ]

  const mainCardData = {
    title: "Main Content",
    description: "Primary content area",
    content: <p>Main content goes here.</p>,
    className: "md:min-h-min",
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {cardData.map((card, index) => (
          <DataCard
            key={index}
            title={card.title}
            description={card.description}
            content={card.content}
          />
        ))}
      </div>
      <DataCard
        title={mainCardData.title}
        description={mainCardData.description}
        content={mainCardData.content}
        className={mainCardData.className}
      />
    </div>
  )
}