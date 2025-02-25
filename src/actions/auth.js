"use server"

export async function register(formData) {
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    console.log(email)
    console.log(password)
    console.log(confirmPassword)

    // ตัวอย่างการตรวจสอบ
    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    return { success: true };
}