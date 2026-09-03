import React, { useState } from 'react'
import RealTime from './ui/real-time'
import { BiCopy, BiLogoWhatsapp, BiPhoneCall } from 'react-icons/bi'
import { IconBase } from 'react-icons'
import Icon from './Icon'
import ContactForm from './ContactForm'
import type { Contact } from '@/types/contents.types'

interface ContactSectionProps {
    heading: string
    contact: Contact
    reachOutLabel: string
    formspreeId: string
}

const ContactSection = ({ heading, contact, reachOutLabel, formspreeId }: ContactSectionProps) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(contact.email)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div>
            <h2 className="text-2xl font-medium mb-8 ">{heading}</h2>
            <div className='flex gap-4   justify-between sm:flex-row flex-col-reverse'>
                <div className='flex flex-col sm:gap-6 gap-3 border-secondary border-l pl-4'>
                    <div className='flex gap-2 items-center'>
                        <h3 className='sm:text-lg text-sm font-medium'>Time for me:</h3>
                        <p className='text-secondary text-sm sm:text-base'><RealTime timezone={contact.timezone} timeFormat="hh:mm A" /></p>
                    </div>
                    <div className='flex flex-col gap-2 items-start'>
                        <h3 className='sm:text-lg text-sm font-medium'>Email:</h3>
                        <button onClick={handleCopy} className='cursor-pointer text-sm sm:text-base'>
                            <BiCopy className='inline-block mr-2 text-primary' size={16} />
                            <span>
                                {copied ? "Copied!" : contact.email}
                            </span>
                        </button>
                    </div>
                    <div className='flex flex-col gap-2 items-start'>
                        <h3 className='sm:text-lg text-sm font-medium'>Phone:</h3>
                        <a href={`tel:${contact.phone}`} className='cursor-pointer text-sm sm:text-base'>
                            <BiPhoneCall className='inline-block mr-2 text-primary' size={16} />
                            <span>{contact.phone}</span>
                        </a>
                    </div>
                    <div className='flex flex-col gap-2 items-start'>
                        <h3 className='sm:text-lg text-sm font-medium'>WhatsApp:</h3>
                        <a href={contact.whatsapp?.link} className='cursor-pointer text-sm sm:text-base'>
                            <BiLogoWhatsapp className='inline-block mr-2 text-primary' size={16} />
                            <span>{contact.whatsapp?.number}</span>
                        </a>
                    </div>
                    <div className='flex flex-col gap-2 items-start'>
                        <h3 className='sm:text-lg text-sm font-medium'>Social Links:</h3>
                        <div className='text-sm sm:text-base'>
                            {contact.social.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.link}
                                    className='flex items-center gap-2 text-secondary hover:text-primary rounded-xl hover:bg-black/5 transition-colors -translate-x-3 px-3 py-1 mb-2'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                   <Icon name={social.icon as keyof typeof IconBase} size={16} />
                                   <span className='sm:text-lg text-sm'>{social.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-3 w-full max-w-xl'>
                    {/* Placeholder for a contact form or additional content */}
                    <h3>{reachOutLabel}</h3>
                    <ContactForm formspreeId={formspreeId} />
                </div>
            </div>
        </div>
    )
}

export default ContactSection