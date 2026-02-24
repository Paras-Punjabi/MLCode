'use client'
import { Card, CardContent } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'
import { ChangeEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function Page() {
  const [formData, setFormData] = useState<{
    problemSlug: string;
    problemName: string;
    problemDesc: string;
    problemTags: string;
    problemLevel: string;
  }>({
    problemSlug: '',
    problemName: '',
    problemDesc: '',
    problemTags: '',
    problemLevel: '',
  })

  const [addedFiles, setAddedFiles] = useState<File[]>([])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(d => ({ ...d, [name]: value }))
  }

  const difficultyOpts = [
    { label: 'Easy', value: 'EASY' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Hard', value: 'HARD' },
  ]

  const REQ_FILES = [
    "train.csv",
    "test.csv",
    "variables.json",
    "schema.json",
    "answer.csv",
  ] as const

  const handleFileChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const validFiles: File[] = []
    for (const file of files) {
      const name = file.name as typeof REQ_FILES[number]
      if (REQ_FILES.includes(name)) {
        validFiles.push(file)
      }
    }
    setAddedFiles(validFiles)
  }

  const handleCreateProblem = () => {
    const fd = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, value)
    })
    // TODO add files to formdata and upload
  }

  return (
    <div className=''>
      <header className='mb-8'>
        <h3 className='text-2xl'>Create problem</h3>
      </header>

      <Card>
        <CardContent className='grid grid-cols-2 gap-8'>
          <div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="problemName">Problem Name</FieldLabel>
                <Input id="problemName" name='problemName' placeholder="Enter problem name" onChange={handleChange} value={formData.problemName} />
              </Field>
              <Field>
                <FieldLabel htmlFor="problemSlug">Problem Slug</FieldLabel>
                <Input id="problemSlug" name='problemSlug' placeholder="Enter problem slug" onChange={handleChange} value={formData.problemSlug} />
              </Field>
              <Field>
                <FieldLabel htmlFor="problemDesc">Problem Description</FieldLabel>
                <Textarea placeholder='Enter description in markdown' name='problemDesc' className='h-60 resize-none' onChange={handleChange} value={formData.problemDesc} />
              </Field>
              <Field>
                <FieldLabel htmlFor="problemLevel">Difficulty</FieldLabel>
                <Select onValueChange={v => setFormData(d => ({ ...d, problemLevel: v }))} value={formData.problemLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dificulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOpts.map(({ label, value }, i) => (
                      <SelectItem key={i} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="problemTags">Problem Tags</FieldLabel>
                <Input placeholder='regression, classification, ...' name='problemTags' onChange={handleChange} value={formData.problemTags} type="text" />
                <FieldDescription>
                  Enter comma separated problem tags
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="files">Dataset and Answer Files</FieldLabel>
                <Input type="file" multiple accept=".csv,.json" onChange={handleFileChange} />
                <FieldDescription>
                  Upload files:
                  {REQ_FILES.map(f => <Kbd className='ml-1' key={f}>{f}</Kbd>)}
                </FieldDescription>
                {(addedFiles.length > 0) && (
                  <div className='text-muted-foreground text-sm'>
                    Files selected:
                    <ul className="space-y-2">
                      {addedFiles.map(({ name, size }) => (
                        <li
                          key={name}
                          className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm"
                        >
                          <span className="font-mono truncate text-foreground">{name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            ({(size / 1024).toFixed(1)} KB)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Field>
              <Button type="button" variant="default" className='w-full' onClick={handleCreateProblem}>Submit</Button>
            </FieldGroup>
          </div>
          <div>
            {formData.problemSlug && (
              <div className='bg-transparent border border-input px-3 py-2 flex items-center font-mono text-sm rounded-md'>
                <span>
                  {`/problemset/${formData.problemSlug}`}
                </span>
              </div>
            )}
            <div className='problem-preview'>
              {formData.problemName && <h1>{formData.problemName}</h1>}
              <div className='flex flex-row items-start justify-between my-4'>
                <div className='flex flex-row gap-2'>
                  {formData.problemTags && formData.problemTags.split(',').filter(t => t.trim().length).map((tag, i) => <Badge key={i}>{tag.trim()}</Badge>)}
                </div>
                {formData.problemLevel && <Badge className={cn({
                  ['bg-success']: formData.problemLevel === 'EASY',
                  ['bg-warning']: formData.problemLevel === 'MEDIUM',
                  ['bg-error']: formData.problemLevel === 'HARD',
                })} >{formData.problemLevel}</Badge>}
              </div>
              <ReactMarkdown>{formData.problemDesc}</ReactMarkdown>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
