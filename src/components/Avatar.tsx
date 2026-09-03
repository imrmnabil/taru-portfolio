import React from 'react'
import ExportedImage from "@/components/ui/exported-image";
import type { Avatar as AvatarType } from '@/types/contents.types'

const Avatar = ({ avatar }: { avatar: AvatarType }) => {
    return (
        <ExportedImage
            src={avatar.src}
            alt={avatar.alt}
            width={avatar.width || 100}
            height={avatar.height || 100}
            className={`rounded-3xl border-white border-4 shadow-lg w-24 h-24 sm:w-[200px] sm:h-[200px] object-cover`}
        />
    )
}

export default Avatar
