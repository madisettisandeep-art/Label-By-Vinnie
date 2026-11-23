import os
import re
import json
import requests
from PIL import Image
import io

def slugify(text, max_len=30):
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    text = re.sub(r'[-\s]+', '_', text)
    return text[:max_len].rstrip('_')

def get_product_title(caption, default="stock_item"):
    lines = [l.strip() for l in caption.split("\n") if l.strip()]
    if not lines:
        return default
    first = lines[0].replace('*', '').strip()
    slug = slugify(first, max_len=30)
    return slug if slug else default

def main():
    with open("all_stock_metadata.json", "r", encoding="utf-8") as f:
        items = json.load(f)
        
    img_dir = os.path.join(os.getcwd(), "images")
    os.makedirs(img_dir, exist_ok=True)
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    }
    
    catalog = []
    
    # 1. Download profile pic
    try:
        with open("profile_node.json", "r", encoding="utf-8") as f:
            p_node = json.load(f)
        p_url = p_node.get("profile_pic_url_hd") or p_node.get("profile_pic_url")
        if p_url:
            p_filename = "profile_picture_label_by_vinnie.jpg"
            p_path = os.path.join(img_dir, p_filename)
            r = requests.get(p_url, headers=headers, timeout=20)
            if r.status_code == 200:
                with open(p_path, "wb") as pf:
                    pf.write(r.content)
                img = Image.open(p_path)
                w, h = img.size
                catalog.append({
                    "filename": p_filename,
                    "category": "Brand Assets",
                    "title": "Official Profile Picture / Logo",
                    "caption": p_node.get("biography", ""),
                    "resolution": f"{w}x{h}",
                    "size_kb": round(len(r.content) / 1024, 1),
                    "source_url": "https://www.instagram.com/label_by_vinnie/"
                })
                print(f"Downloaded profile picture: {p_filename} ({w}x{h})")
    except Exception as e:
        print(f"Error downloading profile pic: {e}")

    # 2. Download items
    for item in items:
        if item.get("type") == "highlight_cover":
            h_name = slugify(item["title"])
            clean_filename = f"highlight_cover_{h_name}.jpg"
            save_path = os.path.join(img_dir, clean_filename)
            url = item["image_urls"][0]
            print(f"Downloading {clean_filename}...")
            r = requests.get(url, headers=headers, timeout=20)
            if r.status_code == 200:
                with open(save_path, "wb") as f:
                    f.write(r.content)
                try:
                    img = Image.open(save_path)
                    w, h = img.size
                except:
                    w, h = (0, 0)
                catalog.append({
                    "filename": clean_filename,
                    "category": "Story Highlights Cover",
                    "title": item["title"],
                    "caption": item["caption"],
                    "resolution": f"{w}x{h}",
                    "size_kb": round(len(r.content) / 1024, 1),
                    "source_url": "https://www.instagram.com/label_by_vinnie/"
                })
        elif item.get("type") == "post":
            p_idx = item["index"]
            code = item["code"]
            caption = item.get("caption", "")
            title_slug = get_product_title(caption, default=f"item_{p_idx}")
            images = item.get("images", [])
            
            for s_idx, img_info in enumerate(images):
                if len(images) > 1:
                    fname = f"{p_idx:02d}_{title_slug}_slide_{s_idx+1}_{code}.jpg"
                else:
                    fname = f"{p_idx:02d}_{title_slug}_{code}.jpg"
                    
                save_path = os.path.join(img_dir, fname)
                url = img_info["url"]
                print(f"Downloading [{p_idx}] {fname}...")
                try:
                    r = requests.get(url, headers=headers, timeout=20)
                    if r.status_code == 200:
                        with open(save_path, "wb") as f:
                            f.write(r.content)
                        try:
                            img = Image.open(save_path)
                            w, h = img.size
                        except:
                            w, h = (0, 0)
                        catalog.append({
                            "filename": fname,
                            "category": "Stock Post",
                            "post_index": p_idx,
                            "post_code": code,
                            "slide_index": s_idx + 1,
                            "title": title_slug.replace('_', ' ').title(),
                            "caption": caption,
                            "resolution": f"{w}x{h}",
                            "size_kb": round(len(r.content) / 1024, 1),
                            "post_url": item.get("post_url")
                        })
                    else:
                        print(f"  HTTP error {r.status_code} for {fname}")
                except Exception as ex:
                    print(f"  Error downloading {fname}: {ex}")

    with open("stock_inventory.json", "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)
    print(f"\nAll images downloaded! Total saved: {len(catalog)}")

if __name__ == "__main__":
    main()
