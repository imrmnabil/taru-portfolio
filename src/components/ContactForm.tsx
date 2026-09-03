import React from 'react'
import { useForm, ValidationError } from '@formspree/react';

const ContactForm = ({ formspreeId }: { formspreeId: string }) => {
    const [state, handleSubmit] = useForm(formspreeId);
    
    React.useEffect(() => {
        if (state.succeeded) {
            const toast = document.createElement('div');
            toast.textContent = "Thanks for reaching out! I'll get back to you soon.";
            toast.className = 'fixed bottom-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg';
            document.body.appendChild(toast);

            const timeout = setTimeout(() => {
                document.body.removeChild(toast);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [state.succeeded]);

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4'>
                <div>
                    <input 
                        id="name"
                        type="text" 
                        name="name"
                        placeholder="Your Name" 
                        className='w-full border border-secondary p-2 rounded-lg bg-black/5' 
                    />
                    <ValidationError 
                        prefix="Name" 
                        field="name"
                        errors={state.errors}
                        className="text-red-500 text-sm mt-1"
                    />
                </div>
                
                <div>
                    <input 
                        id="email"
                        type="email" 
                        name="email"
                        placeholder="Your Email" 
                        className='w-full border border-secondary p-2 rounded-lg bg-black/5' 
                    />
                    <ValidationError 
                        prefix="Email" 
                        field="email"
                        errors={state.errors}
                        className="text-red-500 text-sm mt-1"
                    />
                </div>
                
                <div>
                    <textarea 
                        id="message"
                        name="message"
                        placeholder="Your Message" 
                        className='w-full border border-secondary p-2 rounded-lg bg-black/5 sm:h-72 h-20' 
                    />
                    <ValidationError 
                        prefix="Message" 
                        field="message"
                        errors={state.errors}
                        className="text-red-500 text-sm mt-1"
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={state.submitting}
                    className='bg-primary text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity'
                >
                    {state.submitting ? 'Sending...' : 'Send Message'}
                </button>
            </div>
        </form>
    )
}

export default ContactForm