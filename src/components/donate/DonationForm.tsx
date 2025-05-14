
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Heart, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { formatCurrency, convertCurrency } from '@/lib/donations';

const DonationForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    amount: '',
    currency: 'USD',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currencies = [
    { code: 'USD', label: 'US Dollar ($)' },
    { code: 'TZS', label: 'Tanzanian Shilling (TSh)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'GBP', label: 'British Pound (£)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate amount
      const amountValue = parseFloat(formState.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error('Please enter a valid donation amount.');
      }
      
      // Save donation to database
      const { error } = await supabase
        .from('donations')
        .insert({
          name: formState.name,
          email: formState.email,
          amount: amountValue,
          currency: formState.currency,
          message: formState.message,
          status: 'pending',
          payment_method: 'website_form'
        });
      
      if (error) throw error;
      
      toast({
        title: "Thank you for your donation!",
        description: "Your support is greatly appreciated. We'll be in touch soon.",
      });
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        amount: '',
        currency: 'USD',
        message: '',
      });
    } catch (error: any) {
      toast({
        title: "Error processing donation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEquivalentAmount = () => {
    if (!formState.amount || isNaN(Number(formState.amount))) return null;
    
    const amount = parseFloat(formState.amount);
    if (formState.currency === 'USD') {
      const tzsAmount = convertCurrency(amount, 'USD', 'TZS');
      return `${formatCurrency(tzsAmount, 'TZS')}`;
    } else if (formState.currency === 'TZS') {
      const usdAmount = convertCurrency(amount, 'TZS', 'USD');
      return `${formatCurrency(usdAmount, 'USD')}`;
    }
    return null;
  };

  const equivalentAmount = getEquivalentAmount();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 bg-[#191970] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-display font-semibold">
              Support My Work
            </h3>
            <p className="mt-1 text-white/80 text-sm">
              Your donation helps me continue building and innovating.
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-full">
            <Heart className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Donation Amount *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="any"
                required
                value={formState.amount}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="25.00"
              />
            </div>
            {equivalentAmount && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Equivalent to approximately {equivalentAmount}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formState.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formState.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="Add a message to your donation..."
          />
        </div>

        <div>
          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={loading}
            icon={loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <ArrowRight size={16} />}
            iconPosition="right"
          >
            {loading ? 'Processing...' : 'Donate Now'}
          </Button>
        </div>

        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          <p>Your contribution helps support innovation and technology development in Tanzania.</p>
          <p className="mt-1">Thank you for your support!</p>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
