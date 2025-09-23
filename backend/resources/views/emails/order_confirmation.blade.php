<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .email-header {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .email-header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .email-header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .order-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 25px;
            margin-top: 15px;
            font-weight: 600;
            font-size: 14px;
        }
        
        .email-body {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 25px;
            color: #2c3e50;
        }
        
        .order-summary {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .order-summary h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 20px;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
        }
        
        .order-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .order-table th {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
        }
        
        .order-table td {
            padding: 15px 12px;
            border-bottom: 1px solid #eee;
        }
        
        .order-table tr:last-child td {
            border-bottom: none;
        }
        
        .order-table tr:hover {
            background: #f8f9fa;
        }
        
        .item-name {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .quantity {
            text-align: center;
            font-weight: 600;
            color: #666;
        }
        
        .price {
            text-align: right;
            font-weight: 600;
            color: #4CAF50;
        }
        
        .total-section {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: right;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
        }
        
        .total-final {
            border-top: 2px solid #4CAF50;
            padding-top: 15px;
            margin-top: 15px;
        }
        
        .total-final .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .payment-info {
            background: #e3f2fd;
            border-left: 4px solid #2196F3;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .payment-info h4 {
            color: #1976D2;
            margin-bottom: 8px;
        }
        
        .status-badge {
            display: inline-block;
            background: #fff3cd;
            color: #856404;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            border: 1px solid #ffeaa7;
        }
        
        .next-steps {
            background: #fff;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .next-steps h4 {
            color: #4CAF50;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .next-steps ul {
            list-style: none;
            padding-left: 0;
        }
        
        .next-steps li {
            padding: 8px 0;
            position: relative;
            padding-left: 25px;
        }
        
        .next-steps li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #4CAF50;
            font-weight: bold;
        }
        
        .footer {
            background: #2c3e50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer p {
            margin-bottom: 10px;
        }
        
        .contact-info {
            margin-top: 20px;
            font-size: 14px;
            opacity: 0.8;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
            }
            
            .email-body {
                padding: 20px 15px;
            }
            
            .order-table th,
            .order-table td {
                padding: 10px 8px;
                font-size: 14px;
            }
            
            .total-amount {
                font-size: 20px !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for choosing our salon products</p>
            <div class="order-badge">
                Order #{{ $order->order_id }}
            </div>
        </div>
        
        <div class="email-body">
            <div class="greeting">
                Hello valued customer,
            </div>
            
            <p>We're excited to confirm that your order has been successfully placed and is now being prepared for delivery.</p>
            
            <div class="order-summary">
                <h3>Order Summary</h3>
                
                <table class="order-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th style="text-align: center;">Quantity</th>
                            <th style="text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($order->orderDetails as $detail)
                            <tr>
                                <td class="item-name">{{ $detail->inventory->name }}</td>
                                <td class="quantity">{{ $detail->quantity }}</td>
                                <td class="price">${{ number_format($detail->price * $detail->quantity, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            
            <div class="total-section">
                <div class="total-row total-final">
                    <span style="font-size: 18px; color: #666;">Total Amount: </span>
                    <span class="total-amount"> ${{ number_format($order->total_price, 2) }} USD</span>
                </div>
            </div>
            
            <div class="payment-info">
                <h4>Payment Information</h4>
                <p><strong>Method:</strong> {{ ucfirst($order->payment_method) }}</p>
                <p><strong>Status:</strong> <span class="status-badge">{{ ucfirst($order->status) }}</span></p>
                <p><strong>Order Date:</strong> {{ $order->order_date->format('F j, Y \a\t g:i A') }}</p>
            </div>
            
            <div class="next-steps">
                <h4>What happens next?</h4>
                <ul>
                    <li>We'll prepare your order within 24 hours</li>
                    <li>You'll receive a shipping confirmation email</li>
                    <li>Your products will be delivered within 2-3 business days</li>
                    <li>Payment will be collected upon delivery</li>
                </ul>
            </div>
            
            <p>If you have any questions about your order, please don't hesitate to contact our customer service team.</p>
        </div>
        
        <div class="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p>We appreciate your trust in our premium salon products.</p>
            
            <div class="contact-info">
                <p>Questions? Contact us at support@zenstyle.com or call +012 345 67890</p>
                <p>Visit our website: www.Zenstyle.com</p>
            </div>
        </div>
    </div>
</body>
</html>