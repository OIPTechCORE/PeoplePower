import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Send, 
  Receive, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Zap,
  DollarSign,
  Activity,
  RefreshCw,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

interface PaymentData {
  id: string;
  amount: number;
  fee: number;
  type: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  paymentId: string;
  transactionHash?: string;
}

interface UserBalance {
  available: number;
  staked: number;
  totalEarned: number;
  pending: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'ton' | 'card' | 'crypto';
  fee: number;
  processingTime: string;
  isAvailable: boolean;
}

const TONPaymentInterface: React.FC = () => {
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'ton',
      name: 'TON Blockchain',
      icon: '₮',
      type: 'ton',
      fee: 0.025,
      processingTime: 'Instant',
      isAvailable: true
    },
    {
      id: 'card',
      name: 'Credit Card',
      icon: '💳',
      type: 'card',
      fee: 0.05,
      processingTime: '2-3 minutes',
      isAvailable: false
    },
    {
      id: 'crypto',
      name: 'Other Crypto',
      icon: '₿',
      type: 'crypto',
      fee: 0.03,
      processingTime: '5-10 minutes',
      isAvailable: false
    }
  ]);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('ton');
  const [paymentType, setPaymentType] = useState('game_payment');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      // Fetch user balance
      const balanceResponse = await fetch('/api/v1/ton/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const balanceData = await balanceResponse.json();
      setUserBalance(balanceData.data);

      // Fetch payment history
      const paymentsResponse = await fetch('/api/v1/ton/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const paymentsData = await paymentsResponse.json();
      setPayments(paymentsData.data || []);
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
    }
  };

  const handlePayment = async () => {
    if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
      setTransactionStatus('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    setTransactionStatus(null);

    try {
      const payload: any = {
        amount: paymentAmount,
        paymentType
      };

      if (paymentType === 'tip' && recipientAddress) {
        payload.recipientAddress = recipientAddress;
      }

      if (paymentMessage) {
        payload.message = paymentMessage;
      }

      const response = await fetch('/api/v1/ton/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setTransactionStatus('Payment initiated successfully!');
        setPaymentAmount('');
        setPaymentMessage('');
        setRecipientAddress('');
        await fetchPaymentData();
      } else {
        setTransactionStatus(`Payment failed: ${result.error}`);
      }
    } catch (error) {
      setTransactionStatus('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatTON = (amount: number) => {
    return `${amount.toFixed(4)} TON`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const calculateFee = (amount: number, method: PaymentMethod) => {
    return amount * method.fee;
  };

  const calculateTotal = (amount: number, method: PaymentMethod) => {
    return amount + calculateFee(amount, method);
  };

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TON Payment Center</h1>
          <p className="text-gray-600">Secure blockchain payments with instant processing</p>
        </div>

        {/* Balance Overview */}
        {userBalance && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Available Balance</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      {showBalance ? formatCurrency(userBalance.available) : '••••••'}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-white hover:bg-blue-700"
                      >
                        {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </p>
                  </div>
                  <div className="text-3xl"><Wallet className="h-8 w-8" /></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Staked Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(userBalance.staked)}</p>
                  </div>
                  <div className="text-3xl"><Shield className="h-8 w-8" /></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Earned</p>
                    <p className="text-2xl font-bold">{formatCurrency(userBalance.totalEarned)}</p>
                  </div>
                  <div className="text-3xl"><TrendingUp className="h-8 w-8" /></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Pending</p>
                    <p className="text-2xl font-bold">{formatCurrency(userBalance.pending)}</p>
                  </div>
                  <div className="text-3xl"><Clock className="h-8 w-8" /></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="payment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payment">Send Payment</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          </TabsList>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="payment-type">Payment Type</Label>
                    <Select value={paymentType} onValueChange={setPaymentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="game_payment">Game Payment</SelectItem>
                        <SelectItem value="stake_payment">Stake Tokens</SelectItem>
                        <SelectItem value="gift_payment">Send Gift</SelectItem>
                        <SelectItem value="marketplace_payment">Marketplace</SelectItem>
                        <SelectItem value="tip">Send Tip</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentType === 'tip' && (
                    <div>
                      <Label htmlFor="recipient">Recipient Address</Label>
                      <Input
                        id="recipient"
                        type="text"
                        placeholder="Enter recipient wallet address"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="amount">Amount (TON)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Input
                      id="message"
                      type="text"
                      placeholder="Add a message"
                      value={paymentMessage}
                      onChange={(e) => setPaymentMessage(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  {selectedPaymentMethod && paymentAmount && !isNaN(Number(paymentAmount)) && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Amount:</span>
                        <span>{formatTON(Number(paymentAmount))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fee ({(selectedPaymentMethod.fee * 100).toFixed(1)}%):</span>
                        <span>{formatTON(calculateFee(Number(paymentAmount), selectedPaymentMethod))}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>{formatTON(calculateTotal(Number(paymentAmount), selectedPaymentMethod))}</span>
                      </div>
                    </div>
                  )}

                  {transactionStatus && (
                    <Alert className={
                      transactionStatus.includes('success') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{transactionStatus}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    onClick={handlePayment}
                    disabled={isProcessing || !paymentAmount || Number(paymentAmount) <= 0}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Payment
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      All payments are processed securely through the TON blockchain with instant confirmation.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">Instant Processing</h4>
                      <p className="text-sm text-blue-700">
                        Payments are processed instantly with blockchain confirmation.
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-1">Low Fees</h4>
                      <p className="text-sm text-green-700">
                        Enjoy competitive fees starting from 2.5% for TON payments.
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-1">Secure & Private</h4>
                      <p className="text-sm text-purple-700">
                        All transactions are encrypted and stored securely on the blockchain.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Payment Limits</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Minimum Payment:</span>
                        <span>0.01 TON</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Limit:</span>
                        <span>1,000 TON</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Limit:</span>
                        <span>10,000 TON</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Transaction History
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={fetchPaymentData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No transactions found</p>
                    </div>
                  ) : (
                    payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">
                            {payment.type === 'game_payment' ? '🎮' :
                             payment.type === 'stake_payment' ? '💎' :
                             payment.type === 'gift_payment' ? '🎁' :
                             payment.type === 'marketplace_payment' ? '🛒' : '💸'}
                          </div>
                          <div>
                            <p className="font-medium">{formatTON(payment.amount)}</p>
                            <p className="text-sm text-gray-500">{payment.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(payment.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(payment.status)}
                              {payment.status}
                            </div>
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(payment.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <Card 
                      key={method.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedMethod === method.id ? 'ring-2 ring-blue-500' : ''
                      } ${!method.isAvailable ? 'opacity-50' : ''}`}
                      onClick={() => method.isAvailable && setSelectedMethod(method.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{method.icon}</div>
                            <div>
                              <h3 className="font-semibold">{method.name}</h3>
                              <p className="text-sm text-gray-600">{method.processingTime}</p>
                            </div>
                          </div>
                          {method.isAvailable ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Fee:</span>
                          <span className="font-bold">{(method.fee * 100).toFixed(1)}%</span>
                        </div>

                        {!method.isAvailable && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-700">
                            Coming soon
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TONPaymentInterface;
