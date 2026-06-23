import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Send, Mail, User, Phone, MessageSquare, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Car } from '../types.js';

interface MessageModalProps {
  car: Car;
  onClose: () => void;
}

interface MessageFormInputs {
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  message: string;
}

export const MessageModal: React.FC<MessageModalProps> = ({ car, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MessageFormInputs>({
    defaultValues: {
      buyer_name: '',
      buyer_email: '',
      buyer_phone: '',
      message: `Hi, I am interested in the ${car.year} ${car.title} listed for ${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(car.price)}. Please let me know its availability and the next steps for a private inquiry.`
    }
  });

  const onSubmit = async (data: MessageFormInputs) => {
    setIsSubmitting(true);
    try {
      const payload = {
        car_id: car.id,
        ...data
      };

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to submit message');
      }

      toast.success("Your message has been sent! We'll be in touch soon.", {
        style: {
          background: '#1A1A1A',
          color: '#F5F5F5',
          border: '1px solid #C9A84C',
          borderRadius: '2px',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px'
        }
      });
      reset();
      onClose();
    } catch (err: any) {
      toast.error('Could not send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="message-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white text-neutral-900 w-full max-w-lg rounded-sm overflow-hidden shadow-2xl relative border-t-4 border-accent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-900 p-6 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-accent font-bold font-heading">
              Inquire About Vehicle
            </span>
            <h3 className="text-sm font-heading font-bold uppercase tracking-tight text-neutral-200 mt-1">
              {car.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            id="close-message-modal-btn"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Buyer Name */}
          <div>
            <label className="block text-[10px] font-heading uppercase font-bold text-neutral-500 tracking-wider mb-1.5">
              Your Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                {...register('buyer_name', { required: 'Name is required' })}
                id="message-buyer-name"
                placeholder="e.g. Robert Vancouver"
                className={`w-full bg-neutral-50 border ${
                  errors.buyer_name ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-accent'
                } rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition-colors`}
              />
            </div>
            {errors.buyer_name && (
              <p className="text-[10px] text-red-500 mt-1">{errors.buyer_name.message}</p>
            )}
          </div>

          {/* Email and Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-heading uppercase font-bold text-neutral-500 tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  {...register('buyer_email')}
                  id="message-buyer-email"
                  placeholder="e.g. robert@vancouver.ca"
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-accent rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-heading uppercase font-bold text-neutral-500 tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="tel"
                  {...register('buyer_phone')}
                  id="message-buyer-phone"
                  placeholder="e.g. 604-555-0100"
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-accent rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Inquiry Message */}
          <div>
            <label className="block text-[10px] font-heading uppercase font-bold text-neutral-500 tracking-wider mb-1.5">
              Personal Message *
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
              <textarea
                rows={5}
                {...register('message', { required: 'Inquiry message details are required' })}
                id="message-buyer-text"
                className={`w-full bg-neutral-50 border ${
                  errors.message ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-accent'
                } rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition-colors resize-none`}
              />
            </div>
            {errors.message && (
              <p className="text-[10px] text-red-500 mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            id="message-submit-btn"
            className="w-full bg-accent hover:bg-accent-hover disabled:bg-neutral-300 disabled:cursor-not-allowed text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider py-3.5 rounded-sm transition-all flex items-center justify-center space-x-2 border border-accent cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Secure Inquiry...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Inquiry to KSA Classic</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
