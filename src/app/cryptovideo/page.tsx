"use client"
import { useState, useRef, useEffect, useEffectEvent } from "react"
import { Buffer } from "buffer"
import { buffer } from "stream/consumers"

export default function CryptoVideo() {

    const [pwd, setpwd] = useState("")
    const [cipher, setcipher] = useState("")
    const [gnonce, setgnonce] = useState<Uint8Array | null>(null)
    const [giv, setgiv] = useState<Uint8Array | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const downRef = useRef<HTMLAnchorElement>(null)
    const encFileRef = useRef<HTMLInputElement>(null)

    const textToBase64 = (buf: ArrayBuffer) => Buffer.from(buf).toString("base64")
    const base64Totext = (b64: string) => Buffer.from(b64, "base64").buffer


    const driveKey = async (password: string, salt: ArrayBuffer) => {
        const enc = new TextEncoder()

        const keyMetrial = await crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            "PBKDF2",
            false,
            ["deriveKey"]
        )

        return crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: salt, iterations: 100_000, hash: "SHA-256" },
            keyMetrial,
            { name: "AES-CBC", length: 256 },
            false,
            ["encrypt", "decrypt"]
        )

    }
    const handleEncrypt = async () => {
        const file = fileRef.current?.files?.[0]

        if (!file || !pwd) return alert("no file or password found")

        const saltArr = crypto.getRandomValues(new Uint8Array(16))
        const iv = crypto.getRandomValues(new Uint8Array(16))

        setgnonce(saltArr)
        setgiv(iv)

        console.log(`saltArr:::::: ${saltArr}`);
        console.log(`iv::::: ${iv} `);
        const key = await driveKey(pwd, saltArr.buffer)

        const buf = await file.arrayBuffer()

        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-CBC", iv },
            key,
            buf
        )

        console.log(encrypted);

        const combo = new Uint8Array(
            saltArr.length + iv.length + encrypted.byteLength
        )

        combo.set(saltArr, 0)
        combo.set(iv, saltArr.length)
        combo.set(new Uint8Array(encrypted), saltArr.length + iv.length);

        setcipher(textToBase64(combo.buffer));
        console.log(textToBase64(combo.buffer))

        const blob = new Blob([combo], { type: "application/octet-stream" })
        const url = URL.createObjectURL(blob)
        console.log("out donw ref");
        console.log(`this is downref ${downRef.current}`);
        if (downRef.current) {
            console.log(
                "in down ref"
            );
            downRef.current.href = url
            downRef.current.download = `${file.name}.enc`
            downRef.current.click()
        }

        alert("Encrypted file downloaded – keep it safe!")

    }

    const handleDecrypt = async () => {

        const encFile = encFileRef.current?.files?.[0]
        if (!encFile || !pwd) return alert("Nedd encrypted file + password")

        const combo = new Uint8Array(await encFile.arrayBuffer())
        const salt = combo.slice(0, 16)
        const iv = combo.slice(16, 32)
        const cipherText = combo.slice(32)

        const key = await driveKey(pwd, salt.buffer)

        try {
            const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, cipherText)
            const blob = new Blob([decrypted], { type: "video/mp4" })
            const url = URL.createObjectURL(blob)
            if (downRef.current) {
                downRef.current.href = url
                downRef.current.download = "decrypted..mp4"
                downRef.current.click()
            }
        } catch (error) {
            console.log(error);
            alert("Wrong password or corrupted file")
        }
    }

    useEffect(() => {
        console.log(pwd);
        console.log(cipher);
    }, [pwd, cipher])



    return (
        <div style={{ maxWidth: 680, margin: "2rem auto", fontFamily: "sans-serif" }}>
            <h1>Client-side mp4 encrypt / decrypt</h1>
            <fieldset>
                <legend>Encrypt</legend>
                <input type="file" accept=".mp4" ref={fileRef} />
                <br />
                <input type="password" placeholder="password" onChange={e => setpwd(e.target.value)} />
                <br />
                <button onClick={() => handleEncrypt()}>Encrypt</button>
            </fieldset>
            <div>----------------------------------------------------------------</div>
            <div>
                <h2>encryption result</h2>
                <p>nonce:{gnonce}</p>
                <p>iv:{giv}</p>
            </div>
            <div>
                <h1>IPFS + Wallet-key Video Crypto</h1>
                <fieldset>Decrypt</fieldset>
                <input type="file" accept=".enc" ref={encFileRef} />
                <br />
                <input type="password" placeholder="password" value={pwd} onChange={e => setpwd(e.target.value)} />
                <button onClick={() => handleDecrypt()}>Decript & Download</button>
            </div>

            <a ref={downRef} style={{ display: "none" }} />
        </div>
    )
}