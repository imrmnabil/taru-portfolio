import React from 'react'
import { Achievements, TestScore } from '@/types/contents.types'
import Markdown from 'react-markdown'
import { MarkdownComponents } from '@/resources/markdown-components'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import TestScores from './TestScores'
import ExportedImage from "@/components/ui/exported-image";

interface FeatureCardProps {
    achievements: Achievements
    index?: number
}

const FeatureCard = ({ achievements, index }: FeatureCardProps) => {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()])

    return (
        <div style={{
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2.5px 12px 0px',
        }}
         className={`w-full flex flex-col-reverse sm:h-100 ` + (index && index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row') + ' items-center bg-white rounded-xl relative overflow-hidden'}>
            <div className="sm:basis-[40%] p-5 sm:p-10">
                <h2 className="sm:text-2xl text-lg font-semibold">{achievements.title}</h2>
                <div className="mt-2">
                    <Markdown components={MarkdownComponents}>{achievements.content}</Markdown>
                </div>
            </div>
            <div className="md:basis-[60%] h-full w-full">
                {achievements.images && achievements.images.length > 0 && (
                    <div className="relative h-full w-full">
                        {/* Embla Carousel */}
                        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
                            <div className="flex h-full w-full">
                                {achievements.images.map((image, index) => (
                                    <div key={index} className="flex-[0_0_100%] min-w-0 relative h-50 sm:h-100 w-full overflow-hidden">
                                        <ExportedImage
                                            src={image.src}
                                            alt={image.alt || `Achievement Image ${index + 1}`}
                                            className="object-cover w-full h-full"
                                            fill
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

interface FeatureSectionProps {
    heading: string
    achievements: Achievements[]
    testScores: TestScore[]
    testScoresHeading: string
}

const FeatureSection = ({ heading, achievements, testScores, testScoresHeading }: FeatureSectionProps) => {
    return (
        <div>
            <h2 className="text-2xl font-medium mb-8">{heading}</h2>
            <div className="flex flex-col gap-8">
                {achievements.map((achievement, index) => (
                    <FeatureCard index={index} key={index} achievements={achievement} />
                ))}
            </div>
            <div className="mt-8">
                <TestScores heading={testScoresHeading} items={testScores} />
            </div>
        </div>
    )
}

export default FeatureSection
