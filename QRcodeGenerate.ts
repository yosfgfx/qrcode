"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Download, Clipboard, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster, toast } from 'sonner'

// Import the QR code generation library
import qrcode from 'qrcode-generator'

export default function QRCodeGenerator() {
  const [urls, setUrls] = useState<string>('')
  const [qrCodes, setQrCodes] = useState<Array<{ name: string, svg: string }>>([])
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: { svg: boolean, png: boolean } }>({})

  useEffect(() => {
    // Load any saved QR codes from localStorage
    const savedQrCodes = localStorage.getItem('qrCodes')
    if (savedQrCodes) {
      setQrCodes(JSON.parse(savedQrCodes))
    }
  }, [])

  const extractDomain = (url: string): string => {
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch (error) {
      console.error('Invalid URL:', url)
      return url // Return the original string if it's not a valid URL
    }
  }

  const generateQR = () => {
    setIsGenerating(true)
    const urlList = urls.split('\n').map(url => url.trim()).filter(url => url !== '')
    const newQrCodes = urlList.map((url, index) => {
      const qr = qrcode(0, 'L')
      qr.addData(url)
      qr.make()
      const domain = extractDomain(url)
      return {
        name: domain || `QRCode_${index + 1}`,
        svg: qr.createSvgTag({ scalable: true, size: 100 })
      }
    })
    setQrCodes(newQrCodes)
    localStorage.setItem('qrCodes', JSON.stringify(newQrCodes))
    setIsGenerating(false)
  }

  const downloadAll = () => {
    const zip = new JSZip()
    const svgFolder = zip.folder("SVG")
    const pngFolder = zip.folder("PNG")

    qrCodes.forEach((qrCode, index) => {
      svgFolder?.file(`${qrCode.name}.svg`, qrCode.svg)
      
      // Convert SVG to PNG
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            pngFolder?.file(`${qrCode.name}.png`, blob)
          }
          if (index === qrCodes.length - 1) {
            zip.generateAsync({ type: "blob" }).then((content) => {
              const link = document.createElement("a")
              link.href = URL.createObjectURL(content)
              link.download = "QRCodes.zip"
              link.click()
            })
          }
        })
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(qrCode.svg)
    })
  }

  const copyToClipboard = (svg: string, format: 'SVG' | 'PNG', index: number) => {
    if (format === 'SVG') {
      navigator.clipboard.writeText(svg).then(() => {
        setCopiedStates(prev => ({ ...prev, [index]: { ...prev[index], svg: true } }))
        toast.success('SVG copied to clipboard')
        setTimeout(() => setCopiedStates(prev => ({ ...prev, [index]: { ...prev[index], svg: false } })), 2000)
      })
    } else {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(() => {
              setCopiedStates(prev => ({ ...prev, [index]: { ...prev[index], png: true } }))
              toast.success('PNG copied to clipboard')
              setTimeout(() => setCopiedStates(prev => ({ ...prev, [index]: { ...prev[index], png: false } })), 2000)
            })
          }
        })
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svg)
    }
  }

  const downloadSVG = (svg: string, name: string) => {
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${name}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('SVG downloaded')
  }

  const downloadPNG = (svg: string, name: string) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${name}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          toast.success('PNG downloaded')
        }
      })
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svg)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <QrCode className="w-24 h-24 mx-auto mb-4 text-indigo-600" />
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            QR Code Generator
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Create and manage your QR codes easily
          </motion.p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle>Generate QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter URLs here (one per line)"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                rows={4}
                className="mb-4"
              />
              <Button 
                onClick={generateQR} 
                disabled={isGenerating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isGenerating ? 'Generating...' : 'Generate QR Codes'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {qrCodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Generated QR Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {qrCodes.map((qrCode, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-sm truncate" title={qrCode.name}>{qrCode.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div 
                              dangerouslySetInnerHTML={{ __html: qrCode.svg }} 
                              className="flex justify-center"
                            />
                          </CardContent>
                          <CardFooter className="flex flex-wrap justify-between gap-2">
                            <Button 
                              onClick={() => copyToClipboard(qrCode.svg, 'SVG', index)} 
                              variant="outline"
                              className="text-xs"
                            >
                              {copiedStates[index]?.svg ? <CheckCircle className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                              <span className="ml-1">SVG</span>
                            </Button>
                            <Button 
                              onClick={() => copyToClipboard(qrCode.svg, 'PNG', index)} 
                              variant="outline"
                              className="text-xs"
                            >
                              {copiedStates[index]?.png ? <CheckCircle className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                              <span className="ml-1">PNG</span>
                            </Button>
                            <Button 
                              onClick={() => downloadSVG(qrCode.svg, qrCode.name)} 
                              variant="outline"
                              className="text-xs"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              SVG
                            </Button>
                            <Button 
                              onClick={() => downloadPNG(qrCode.svg, qrCode.name)} 
                              variant="outline"
                              className="text-xs"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              PNG
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={downloadAll} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Download All
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Toaster />
    </div>
  )
}