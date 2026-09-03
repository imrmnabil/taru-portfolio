import React from 'react'
import ExportedImage from "@/components/ui/exported-image";
import type { TestScore } from '@/types/contents.types'

interface TestScoresProps {
  heading: string
  items: TestScore[]
}

const TestScores = ({ heading, items }: TestScoresProps) => {
  return (
    <div>
        <h2 className="text-2xl font-semibold mb-4">{heading}</h2>
        <div className='bg-white shadow-lg rounded-xl p-6 flex sm:flex-row gap-6'>
            {items.map((test, index) => (
              <React.Fragment key={test.name}>
                {/* Divider between tests, never after the last one. */}
                {index > 0 && <div className='h-auto w-[1px] bg-primary'></div>}
                <div className='flex-1'>
                    <div className="flex gap-2 relative">
                        <div className='h-10 w-20 relative'>
                            <ExportedImage src={test.logo} alt={test.name} className='object-contain object-left' fill />
                        </div>
                    </div>
                    <ul className='list-disc list-inside ml-4 py-3'>
                        {test.scores.map((score) => (
                          <li key={score.label}>{score.label}: {score.value}</li>
                        ))}
                    </ul>
                </div>
              </React.Fragment>
            ))}
        </div>
    </div>
  )
}

export default TestScores
