import { TimelineItem } from 'components/shared/TimelineItem'
import type { MilestoneItem } from 'types'

interface TimelineItem {
  title: string
  milestones: MilestoneItem[]
}

export function TimelineSection({ timelines }: { timelines: TimelineItem[] }) {
  return (
    <div className="flex flex-col gap-6 pt-16 text-gray-200 md:flex-row">
      {timelines?.map((timeline, key) => {
        const { title, milestones } = timeline
        return (
          <div className="max-w-[80%] md:max-w-[50%]" key={key}>
            <div className="pb-5 font-sans text-xl font-bold text-white">{title}</div>

            {milestones?.map((experience, index) => (
              <div key={index}>
                <TimelineItem
                  milestone={experience}
                  isLast={milestones.length - 1 === index}
                />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
