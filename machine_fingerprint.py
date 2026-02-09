import json
import hashlib
from datetime import datetime
import platform
import os

OUTPUT_FILE = "machine_request.json"


def read_file(path):
    try:
        if os.path.exists(path):
            return open(path, "r").read().strip()
    except:
        pass
    return None


def get_product_uuid():
    """Stable hardware UUID (perfect for licensing)"""
    if platform.system() == "Linux":
        return read_file("/sys/class/dmi/id/product_uuid")
    return None


def get_machine_id():
    """OS-level unique machine ID"""
    if platform.system() == "Linux":
        return read_file("/etc/machine-id")
    return None


def collect_identifiers():
    ids = {
        "product_uuid": get_product_uuid(),
        "machine_id": get_machine_id(),
    }

    # Remove empty fields
    return {k: v for k, v in ids.items() if v}


def hash_fingerprint(ids):
    items = [f"{k}={v}" for k, v in ids.items()]
    joined = "|".join(items)
    return hashlib.sha256(joined.encode()).hexdigest()


def main():
    print("\nCollecting machine identifiers...\n")

    ids = collect_identifiers()

    fingerprint = hash_fingerprint(ids)

    data = {
        "fingerprint": fingerprint,
        "generated_at": datetime.utcnow().isoformat() + "Z",
    }

    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=4)
    print(f"\nMachine data file is generated as {OUTPUT_FILE}")

    print("\nSend this file to the license provider.")


if __name__ == "__main__":
    main()
