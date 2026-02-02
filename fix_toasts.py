import glob
import os

target_dir = r"c:/Users/rahul/Dropbox/PC (2)/Downloads/resources-pen---enterprise-ui-architecture/sections"
files = glob.glob(os.path.join(target_dir, "*.tsx"))

print(f"Scanning {len(files)} files in {target_dir}...")

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        fixed = False
        new_content = content
        
        # Check for both patterns
        patterns = ["onRemove={() => { }}", "onRemove={() => {}}"]
        
        for p in patterns:
            if p in new_content:
                if "setToasts" in content:
                    new_content = new_content.replace(p, "onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))}")
                    fixed = True
                else:
                    print(f"Skipping {os.path.basename(file_path)}: Found pattern but 'setToasts' is missing.")
        
        if fixed:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed: {os.path.basename(file_path)}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
