import { prisma } from './prisma'

export async function checkAndSendStockNotifications() {
  try {
    console.log('Checking stock notifications...')
    
    // Pobierz wszystkie produkty, które są teraz dostępne
    const availableProducts = await prisma.product.findMany({
      where: {
        stock: { gt: 0 }
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        stock: true
      }
    })

    if (availableProducts.length === 0) {
      console.log('No products are currently available')
      return { sent: 0, products: 0 }
    }

    let totalSent = 0

    // Dla każdego dostępnego produktu
    for (const product of availableProducts) {
      // Znajdź wszystkie niepowiadomione subskrypcje dla tego produktu
      const notifications = await prisma.stockNotification.findMany({
        where: {
          productId: product.id,
          notified: false
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      if (notifications.length === 0) continue

      console.log(`Found ${notifications.length} notifications for product: ${product.name}`)

      // Wyślij powiadomienia
      for (const notification of notifications) {
        try {
          await sendStockNotificationEmail({
            to: notification.email,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image,
            productId: product.id,
            userName: notification.user?.name || 'Kliencie'
          })
          
          // Oznacz jako wysłane
          await prisma.stockNotification.update({
            where: { id: notification.id },
            data: {
              notified: true,
              notifiedAt: new Date()
            }
          })
          
          totalSent++
          console.log(`Notification sent to ${notification.email}`)
        } catch (error) {
          console.error(`Error sending notification to ${notification.email}:`, error)
        }
      }
    }

    console.log(`Stock notifications check completed. Sent: ${totalSent}`)
    return { sent: totalSent, products: availableProducts.length }

  } catch (error) {
    console.error('Error in checkAndSendStockNotifications:', error)
    throw error
  }
}

interface EmailData {
  to: string
  productName: string
  productPrice: number
  productImage?: string
  productId: string
  userName: string
}

async function sendStockNotificationEmail(data: EmailData) {
  // TODO: Implement actual email sending with SendGrid, Nodemailer, etc.
  // For now, we'll just log the email content
  
  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Produkt dostępny!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #e91e63;">🎉 Produkt jest dostępny!</h1>
        
        <p>Witaj ${data.userName}!</p>
        
        <p>Mamy dobrą wiadomość! Produkt, o którym chciałeś być powiadomiony, jest teraz dostępny w naszym sklepie.</p>
        
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; background: #f9f9f9;">
          <h2 style="margin-top: 0; color: #e91e63;">${data.productName}</h2>
          <p style="font-size: 24px; font-weight: bold; color: #e91e63;">${data.productPrice.toFixed(2)} zł</p>
          ${data.productImage ? `<img src="${data.productImage}" alt="${data.productName}" style="max-width: 200px; height: auto; border-radius: 4px;">` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/products/${data.productId}" 
             style="background: #e91e63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Zobacz produkt
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          To powiadomienie zostało wysłane automatycznie. Jeśli nie chcesz otrzymywać takich powiadomień, 
          możesz zrezygnować z subskrypcji w ustawieniach swojego konta.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          © 2024 Tulinki Store. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </body>
    </html>
  `

  console.log(`Email to ${data.to}:`)
  console.log(`Subject: 🎉 ${data.productName} jest dostępny!`)
  console.log(`Content: ${emailContent}`)
  
  // TODO: Replace with actual email service
  // Example with SendGrid:
  // await sgMail.send({
  //   to: data.to,
  //   from: 'noreply@tulinki-store.com',
  //   subject: `🎉 ${data.productName} jest dostępny!`,
  //   html: emailContent
  // })
}

// Funkcja do uruchomienia jako cron job
export async function runStockNotificationCron() {
  try {
    const result = await checkAndSendStockNotifications()
    return result
  } catch (error) {
    console.error('Cron job failed:', error)
    throw error
  }
}
