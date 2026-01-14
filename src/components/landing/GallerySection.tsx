'use client'

import Image from 'next/image'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import type { GalleryImage } from '@/types/domain'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

type GallerySectionProps = {
  gallery?: GalleryImage[]
}

export const GallerySection = ({ gallery }: GallerySectionProps) => {
  if (!gallery || gallery.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-4 py-6">
      <div className="px-4 flex justify-between items-end">
        <h3 className="text-(--gray-12) text-lg font-bold">The Shop</h3>
        <span className="text-sm text-(--gray-10)">Swipe to see</span>
      </div>

      <div className="flex w-full overflow-x-auto no-scrollbar px-4 pb-2 gap-4 snap-x snap-mandatory">
        {gallery.map((image) => (
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="snap-start flex-none w-[280px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--accent-8) focus:ring-offset-2 rounded-xl overflow-hidden relative shadow-sm"
              >
                <AspectRatio.Root ratio={4 / 3}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-sm font-medium">{image.alt}</p>
                  </div>
                </AspectRatio.Root>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-2">
              <div className="relative w-full h-[70vh]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
              <p className="text-sm text-(--gray-11) text-center mt-2">{image.alt}</p>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  )
}
