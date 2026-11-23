import os
import re
import json
import time
import requests
import instaloader

def slugify(text, max_len=32):
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    text = re.sub(r'[-\s]+', '_', text)
    return text[:max_len].rstrip('_')

def get_product_title(caption, default="reel"):
    lines = [l.strip() for l in caption.split("\n") if l.strip()]
    if not lines:
        return default
    first = lines[0].replace('*', '').strip()
    slug = slugify(first, max_len=30)
    return slug if slug else default

def main():
    L = instaloader.Instaloader()
    
    videos_dir = os.path.join(os.getcwd(), "videos")
    os.makedirs(videos_dir, exist_ok=True)
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    }
    
    print("Fetching profile data for @label_by_vinnie...")
    edges = []
    try:
        page = L.context.get_page_data("label_by_vinnie/")
        for item in page:
            u = item.get("xig_user_by_username") or {}
            conn = u.get("polaris_ordered_timeline_connection")
            if conn and "edges" in conn:
                edges = conn["edges"]
                break
        print(f"Retrieved {len(edges)} timeline edges directly from profile!")
    except Exception as e:
        print(f"Error fetching profile page: {e}. Falling back to saved codes.")
        
    if not edges:
        # Fallback to known codes from stock inventory
        with open("stock_inventory.json", "r", encoding="utf-8") as f:
            stock = json.load(f)
        seen = set()
        for s in stock:
            c = s.get("post_code")
            if c and c not in seen:
                seen.add(c)
                edges.append({"node": {"code": c, "caption": {"text": s.get("caption", "")}, "__typename": "XIGPolarisVideoMedia"}})
        print(f"Using {len(edges)} codes from stock inventory.")

    video_items = []
    
    for i, edge in enumerate(edges):
        node = edge.get("node", {})
        code = node.get("code")
        typename = node.get("__typename", "")
        caption = node.get("caption", {}).get("text", "") if node.get("caption") else ""
        
        print(f"\n[{i+1}/{len(edges)}] Checking post {code} ({typename})...")
        try:
            p_data = L.context.get_page_data(f"p/{code}/")
            media = p_data[1].get("xig_polaris_media", {})
            ungated = media.get("if_not_gated_logged_out", {}) or {}
            
            # Update caption if better
            if not caption and ungated.get("caption"):
                caption = ungated["caption"].get("text", "")
                
            # 1. Check main video_versions
            video_versions = ungated.get("video_versions", [])
            if video_versions:
                best_url = video_versions[0]["url"]
                video_items.append({
                    "post_index": i + 1,
                    "code": code,
                    "caption": caption,
                    "title": get_product_title(caption, default=f"reel_{i+1}"),
                    "video_url": best_url,
                    "post_url": f"https://www.instagram.com/p/{code}/",
                    "reel_url": f"https://www.instagram.com/reel/{code}/",
                    "type": "reel" if "Clips" in str(ungated.get("product_type", "")) or typename == "XIGPolarisVideoMedia" else "video"
                })
                print(f"  -> Found Video/Reel URL!")
            
            # 2. Check carousel items for any video slides
            carousel_media = ungated.get("carousel_media", [])
            for c_idx, c_item in enumerate(carousel_media):
                c_video_versions = c_item.get("video_versions", [])
                if c_video_versions:
                    c_best_url = c_video_versions[0]["url"]
                    video_items.append({
                        "post_index": i + 1,
                        "code": code,
                        "slide_index": c_idx + 1,
                        "caption": caption,
                        "title": f"{get_product_title(caption)}_slide_{c_idx+1}",
                        "video_url": c_best_url,
                        "post_url": f"https://www.instagram.com/p/{code}/",
                        "reel_url": f"https://www.instagram.com/reel/{code}/",
                        "type": "carousel_video"
                    })
                    print(f"  -> Found Video in Carousel Slide {c_idx+1}!")
        except Exception as e:
            print(f"  Error fetching post {code}: {e}")
        time.sleep(1)

    print(f"\n==========================================")
    print(f"Total video files identified: {len(video_items)}")
    print(f"==========================================")
    
    downloaded_catalog = []
    
    for idx, item in enumerate(video_items):
        title = item["title"]
        code = item["code"]
        fname = f"{item['post_index']:02d}_{title}_{code}.mp4"
        out_path = os.path.join(videos_dir, fname)
        
        print(f"\n[{idx+1}/{len(video_items)}] Downloading: {fname}...")
        try:
            resp = requests.get(item["video_url"], headers=headers, stream=True, timeout=90)
            if resp.status_code == 200:
                with open(out_path, "wb") as f:
                    for chunk in resp.iter_content(chunk_size=1024*128):
                        if chunk:
                            f.write(chunk)
                
                size_mb = round(os.path.getsize(out_path) / (1024 * 1024), 2)
                print(f"  Successfully downloaded ({size_mb} MB) -> {fname}")
                
                downloaded_catalog.append({
                    "filename": fname,
                    "title": title.replace('_', ' ').title(),
                    "caption": item["caption"],
                    "size_mb": size_mb,
                    "post_code": code,
                    "post_url": item["post_url"],
                    "reel_url": item["reel_url"],
                    "type": item["type"]
                })
            else:
                print(f"  HTTP error {resp.status_code} while downloading {fname}")
        except Exception as ex:
            print(f"  Failed to download {fname}: {ex}")

    with open("videos_inventory.json", "w", encoding="utf-8") as f:
        json.dump(downloaded_catalog, f, indent=2)
    print(f"\nAll done! Downloaded {len(downloaded_catalog)} videos into {videos_dir}")

if __name__ == "__main__":
    main()
