# Generates simple illustrated backpack PNGs (run once: python make_images.py)
from PIL import Image, ImageDraw
def bag(name, body, dark, h):
    S=3; W=800*S; im=Image.new("RGB",(W,W),"#EAF0FA"); d=ImageDraw.Draw(im)
    def r(x0,y0,x1,y1,rad,fill): d.rounded_rectangle([v*S for v in (x0,y0,x1,y1)],rad*S,fill=fill)
    top=380-h; bot=700
    r(300,top-40,500,top+40,40,dark)                    # handle
    r(215,top,585,bot,90,body)                          # main body
    r(255,top+150,545,bot-40,50,dark)                   # front pocket
    r(285,top+190,515,top+215,12,body)                  # zip
    r(160,top+120,215,top+330,25,dark); r(585,top+120,640,top+330,25,dark)  # side pockets
    r(330,top+60,470,top+110,25,"#2563EB")              # accent patch
    d.ellipse([v*S for v in (380,top+255,420,top+295)],fill="#2563EB")      # zip pull
    d.ellipse([v*S for v in (200,715,600,745)],fill="#D5DDEC")
    im.resize((800,800),Image.LANCZOS).save(f"images/{name}.png",optimize=True)
bag("travelgo-main","#1F2937","#111827",250)
bag("travelgo-lite","#4B5563","#1F2937",190)
bag("travelgo-pro","#1F2937","#111827",250)
bag("travelgo-max","#0F172A","#1E3A8A",300)
