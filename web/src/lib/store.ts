export type SubmissionStatus = "pendiente" | "aprobado" | "rechazado"

export interface Submission {
  id: number
  nombre: string
  telefono: string
  direccion: string
  plan: string
  notas: string
  recibo: string
  status: SubmissionStatus
  fecha: string
}

let nextId = 1
const submissions: Submission[] = []

export function addSubmission(data: Omit<Submission, "id" | "status" | "fecha">): Submission {
  const submission: Submission = {
    id: nextId++,
    ...data,
    status: "pendiente",
    fecha: new Date().toISOString(),
  }
  submissions.push(submission)
  return submission
}

export function getSubmissions(): Submission[] {
  return submissions
}

export function getSubmissionById(id: number): Submission | undefined {
  return submissions.find((s) => s.id === id)
}

export function updateSubmissionStatus(id: number, status: "aprobado" | "rechazado"): Submission | undefined {
  const submission = submissions.find((s) => s.id === id)
  if (submission) {
    submission.status = status
  }
  return submission
}

let qrImageBase64 = ""

export function getQrImage(): string {
  return qrImageBase64
}

export function setQrImage(base64: string): void {
  qrImageBase64 = base64
}
