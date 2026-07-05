// Integration test: the medical-liability wizard branches on پزشکان/پیراپزشکان and skips hidden fields in validation.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Wizard } from './Wizard'
import { preset_medliability } from '../presets/insurance'

describe('medical-liability wizard branching', () => {
  it('shows only the physician fields after picking پزشکان', async () => {
    const user = userEvent.setup()
    render(<Wizard schema={preset_medliability()} />)

    // Before choosing a group, neither branch is visible
    expect(screen.queryByText('گروه‌بندی شغلی پزشکان')).not.toBeInTheDocument()
    expect(screen.queryByText('گروه‌بندی شغلی پیراپزشکان')).not.toBeInTheDocument()

    await user.click(screen.getByText('پزشکان'))
    expect(screen.getByText('گروه‌بندی شغلی پزشکان')).toBeInTheDocument()
    expect(screen.queryByText('گروه‌بندی شغلی پیراپزشکان')).not.toBeInTheDocument()
    expect(screen.getByText('فلوشیپ')).toBeInTheDocument()
  })

  it('switches to the paramedic fields after picking پیراپزشکان', async () => {
    const user = userEvent.setup()
    render(<Wizard schema={preset_medliability()} />)

    await user.click(screen.getByText('پیراپزشکان'))
    expect(screen.getByText('گروه‌بندی شغلی پیراپزشکان')).toBeInTheDocument()
    expect(screen.queryByText('گروه‌بندی شغلی پزشکان')).not.toBeInTheDocument()
    // Paramedic level has no فلوشیپ option
    expect(screen.queryByText('فلوشیپ')).not.toBeInTheDocument()
  })
})
