import { useState } from 'react'
import { supabase } from '../lib/supabase'

const UploadPage = () => {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) {
      setFile(null)
      setPreview(null)
      return
    }

    // Clear previous errors
    setMessage(null)

    // Validate file type - check MIME type first
    const supportedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()
    const supportedExtensions = ['png', 'jpeg', 'jpg', 'webp']

    let isValidImage = false

    // Check MIME type
    if (selectedFile.type) {
      isValidImage = supportedMimeTypes.includes(selectedFile.type.toLowerCase())
    }

    // If MIME type check fails, check file extension as fallback
    if (!isValidImage && fileExtension) {
      isValidImage = supportedExtensions.includes(fileExtension)
    }

    // If still not valid, check if it's any image type (for edge cases)
    if (!isValidImage && selectedFile.type) {
      if (selectedFile.type.startsWith('image/')) {
        setMessage({ 
          type: 'error', 
          text: `Unsupported image format. Please use PNG, JPEG, or WebP. (Detected: ${selectedFile.type})` 
        })
        setFile(null)
        setPreview(null)
        // Reset file input
        e.target.value = ''
        return
      }
    }

    if (!isValidImage) {
      setMessage({ 
        type: 'error', 
        text: 'Please select a valid image file (PNG, JPEG, JPG, or WebP only)' 
      })
      setFile(null)
      setPreview(null)
      // Reset file input
      e.target.value = ''
      return
    }
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage({ 
        type: 'error', 
        text: `File size is too large (${(selectedFile.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 5MB.` 
      })
      setFile(null)
      setPreview(null)
      // Reset file input
      e.target.value = ''
      return
    }

    // Validate file is not empty
    if (selectedFile.size === 0) {
      setMessage({ type: 'error', text: 'The selected file is empty. Please choose a different file.' })
      setFile(null)
      setPreview(null)
      // Reset file input
      e.target.value = ''
      return
    }

    // All validations passed
    setFile(selectedFile)
    
    // Create preview with error handling
    const reader = new FileReader()
    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Failed to load image preview. Please try a different file.' })
      setFile(null)
      setPreview(null)
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    }
    reader.onloadend = () => {
      if (reader.result) {
        setPreview(reader.result as string)
      } else {
        setMessage({ type: 'error', text: 'Failed to load image preview. Please try a different file.' })
        setFile(null)
        setPreview(null)
      }
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Please enter a name' })
      return
    }

    if (!file) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // Re-validate file before upload (in case it changed)
      if (!file) {
        throw new Error('No file selected')
      }

      // Validate file type one more time before upload
      const supportedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const supportedExtensions = ['png', 'jpeg', 'jpg', 'webp']
      
      let isValidImage = supportedMimeTypes.includes(file.type?.toLowerCase() || '')
      if (!isValidImage && fileExtension) {
        isValidImage = supportedExtensions.includes(fileExtension)
      }

      if (!isValidImage) {
        throw new Error('Unsupported image format. Please use PNG, JPEG, or WebP.')
      }

      // Step 1: Upload image to Supabase Storage
      const fileExt = fileExtension || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `characters/${fileName}`

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('character-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        // Provide more specific error messages
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error('Storage bucket not configured. Please contact the administrator.')
        } else if (uploadError.message.includes('new row violates row-level security')) {
          throw new Error('Permission denied. Please check storage policies.')
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`)
        }
      }

      // Step 2: Get public URL
      const { data: urlData } = supabase.storage
        .from('character-images')
        .getPublicUrl(filePath)

      const imageUrl = urlData.publicUrl

      // Step 3: Insert character into database
      const { error: insertError } = await supabase
        .from('characters')
        .insert({
          name: name.trim(),
          image_url: imageUrl,
          elo_rating: 1500, // Default starting ELO
          total_votes: 0,
          wins: 0,
          losses: 0,
          draws: 0
        })

      if (insertError) throw insertError

      // Success!
      setMessage({ type: 'success', text: 'Character added successfully!' })
      setName('')
      setFile(null)
      setPreview(null)
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (error: any) {
      console.error('Error uploading character:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to upload character. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(to bottom, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ff00 100%)'
    }}>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto" style={{
          background: 'linear-gradient(to bottom, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ff00 100%)',
          border: '8px dotted white',
          padding: '20px'
        }}>
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-yellow-400 border-4 border-black p-3 sm:p-6 mb-4 inline-block">
              <h1 className="text-3xl sm:text-5xl font-bold text-black" style={{ fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif" }}>
                ADD CHARACTER
              </h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-black font-bold text-xl mb-2"
                style={{ fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif" }}
              >
                CHARACTER NAME:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-xl border-4 border-black"
                style={{ 
                  fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif",
                  background: 'white'
                }}
                placeholder="Enter character name"
                disabled={loading}
                maxLength={100}
              />
            </div>

            {/* File Input */}
            <div>
              <label 
                htmlFor="file-input" 
                className="block text-black font-bold text-xl mb-2"
                style={{ fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif" }}
              >
                UPLOAD IMAGE (PNG, JPEG):
              </label>
              <input
                type="file"
                id="file-input"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="w-full px-4 py-3 text-lg border-4 border-black"
                style={{ 
                  fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif",
                  background: 'white'
                }}
                disabled={loading}
              />
              <p className="text-black text-sm mt-2" style={{ fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif" }}>
                Supported formats: PNG, JPEG, JPG, WebP | Max file size: 5MB
              </p>
            </div>

            {/* Preview */}
            {preview && (
              <div className="flex justify-center">
                <div 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    border: '4px solid black',
                    background: 'white',
                    padding: '8px'
                  }}
                >
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div 
                className={`p-4 border-4 border-black text-center ${
                  message.type === 'success' ? 'bg-green-400' : 'bg-red-400'
                }`}
              >
                <p 
                  className="text-black font-bold text-lg"
                  style={{ fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif" }}
                >
                  {message.text}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !name.trim() || !file}
              className="w-full px-8 py-4 text-2xl font-bold text-black border-4 border-black transition-colors"
              style={{
                fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif",
                background: loading || !name.trim() || !file ? 'gray' : 'yellow',
                cursor: loading || !name.trim() || !file ? 'not-allowed' : 'pointer',
                opacity: loading || !name.trim() || !file ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading && name.trim() && file) {
                  e.currentTarget.style.background = '#ffeb3b'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && name.trim() && file) {
                  e.currentTarget.style.background = 'yellow'
                }
              }}
            >
              {loading ? 'UPLOADING...' : 'ADD CHARACTER'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadPage

