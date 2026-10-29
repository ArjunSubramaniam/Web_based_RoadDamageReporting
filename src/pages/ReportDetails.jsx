import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SeverityBadge, StatusBadge } from '../components/Badge.jsx'
import { ConfirmDialog } from '../components/ConfirmDialog.jsx'
import { LoadingState } from '../components/EmptyState.jsx'
import { Modal } from '../components/Modal.jsx'
import { Timeline } from '../components/Timeline.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useStoreTick } from '../hooks/useReports.js'
import { useToast } from '../hooks/useToast.jsx'
import {
  addAdminRemarks,
  addMaintenanceProgress,
  assignMaintenance,
  closeReport,
  getAllowedNextStatuses,
  getReportById,
  getTeams,
  rejectReport,
  startReview,
  updateReportStatus,
  verifyReport,
} from '../services/reportService.js'
import { MAX_IMAGE_BYTES } from '../utils/constants.js'
import { formatDate, isOverdue } from '../utils/format.js'
import { fileToDataUrl } from '../utils/images.js'

export function ReportDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const tick = useStoreTick()
  const { push } = useToast()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [assignOpen, setAssignOpen] = useState(false)
  const [teamId, setTeamId] = useState('team-a')
  const [remark, setRemark] = useState('')
  const [progress, setProgress] = useState('')
  const [photo, setPhoto] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)

  useEffect(() => {
    getReportById(id)
      .then((item) => {
        setReport(item)
        setError('')
      })
      .catch((err) => setError(err.message))
  }, [id, tick, user])

  const run = async (action, success) => {
    setBusy(true)
    try {
      await action()
      push(success)
    } catch (err) {
      push(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6">
        <p className="text-red-700">{error}</p>
        <button type="button" onClick={() => navigate(-1)} className="mt-3 text-sm font-medium text-navy-700">
          Go back
        </button>
      </div>
    )
  }

  if (!report) return <LoadingState />

  const nextStatuses = getAllowedNextStatuses(report.status)
  const teams = getTeams()

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="card space-y-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">{report.id}</p>
            <h1 className="text-2xl font-semibold text-navy-950">{report.title}</h1>
            <p className="mt-1 text-sm text-slate-600">{report.address}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={report.status} />
            <SeverityBadge severity={report.severity} />
            {isOverdue(report) ? <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">Overdue</span> : null}
          </div>
        </div>
        {user.role === 'citizen' && report.citizenId !== user.id ? (
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">This report belongs to another user. You can view the summary, but you cannot change it.</p>
        ) : null}
        {user.role === 'maintenance' && report.assignedTeamId !== user.teamId ? (
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">This task is assigned to another crew, so update actions are hidden.</p>
        ) : null}
        <p className="text-sm leading-6 text-slate-700">{report.description}</p>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">Category</dt><dd className="font-medium">{report.category}</dd></div>
          <div><dt className="text-slate-500">Citizen</dt><dd className="font-medium">{report.citizenName}</dd></div>
          <div><dt className="text-slate-500">Submitted</dt><dd className="font-medium">{formatDate(report.createdAt)}</dd></div>
          <div><dt className="text-slate-500">Assigned team</dt><dd className="font-medium">{report.assignedTeamName || 'Not assigned'}</dd></div>
          <div><dt className="text-slate-500">Coordinates</dt><dd className="font-medium">{report.lat && report.lng ? `${report.lat}, ${report.lng}` : 'Not provided'}</dd></div>
        </dl>
        {report.lat && report.lng ? (
          <p className="text-xs text-slate-500">Coordinates are as supplied with the report and have not been independently verified.</p>
        ) : null}
        {report.imageUrl ? (
          <img src={report.imageUrl} alt="Reported damage" className="max-h-80 w-full rounded-xl object-cover" />
        ) : null}
        {report.completionImageUrl ? (
          <div>
            <h2 className="mb-2 text-sm font-semibold">Completion photograph</h2>
            <img src={report.completionImageUrl} alt="Completion" className="max-h-64 w-full rounded-xl object-cover" />
          </div>
        ) : null}
        {report.adminRemarks ? (
          <div className="rounded-xl bg-navy-50 p-3 text-sm">
            <p className="font-semibold text-navy-900">Administrator remarks</p>
            <p className="mt-1 text-slate-700">{report.adminRemarks}</p>
          </div>
        ) : null}
        {report.maintenanceRemarks ? (
          <div className="rounded-xl bg-amber-50 p-3 text-sm">
            <p className="font-semibold text-amber-900">Maintenance progress</p>
            <p className="mt-1 text-slate-700">{report.maintenanceRemarks}</p>
          </div>
        ) : null}
        {report.rejectReason ? (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
            <p className="font-semibold">Rejection reason</p>
            <p className="mt-1">{report.rejectReason}</p>
          </div>
        ) : null}
      </section>

      <aside className="space-y-4">
        <section className="card p-4 sm:p-5">
          <h2 className="font-semibold text-navy-900">Status timeline</h2>
          <div className="mt-3">
            <Timeline history={report.history} />
          </div>
        </section>

        {user.role === 'admin' ? (
          <section className="card space-y-3 p-4 sm:p-5">
            <h2 className="font-semibold text-navy-900">Administrator actions</h2>
            <div className="flex flex-col gap-2">
              {report.status === 'Submitted' ? (
                <button disabled={busy} onClick={() => run(() => startReview(report.id, user), 'Moved to under review.')} className="btn-secondary w-full">
                  Start review
                </button>
              ) : null}
              {['Submitted', 'Under Review'].includes(report.status) ? (
                <>
                  <button disabled={busy} onClick={() => run(() => verifyReport(report.id, user, remark), 'Report verified.')} className="btn-primary w-full bg-navy-800 hover:bg-navy-700">
                    Verify report
                  </button>
                  <button disabled={busy} onClick={() => setRejectOpen(true)} className="btn-secondary w-full border-red-200 text-red-700 hover:bg-red-50">
                    Reject with reason
                  </button>
                </>
              ) : null}
              {report.status === 'Verified' ? (
                <button disabled={busy} onClick={() => setAssignOpen(true)} className="btn-primary w-full">
                  Assign maintenance team
                </button>
              ) : null}
              {report.status === 'Resolved' ? (
                <button disabled={busy} onClick={() => setConfirmClose(true)} className="btn-primary w-full bg-emerald-700 hover:bg-emerald-800">
                  Review and close
                </button>
              ) : null}
              {nextStatuses.includes('In Progress') && report.status === 'Maintenance Assigned' ? (
                <button disabled={busy} onClick={() => run(() => updateReportStatus(report.id, 'In Progress', user, 'Administrator marked in progress.'), 'Status updated.')} className="btn-secondary w-full">
                  Mark in progress
                </button>
              ) : null}
            </div>
            <label className="block text-sm">
              Administrative remarks
              <textarea value={remark} onChange={(event) => setRemark(event.target.value)} rows={3} className="input mt-1" />
            </label>
            <button
              disabled={busy || !remark.trim()}
              onClick={() => run(() => addAdminRemarks(report.id, remark, user), 'Remarks saved.')}
              className="btn-secondary w-full"
            >
              Save remarks
            </button>
          </section>
        ) : null}

        {user.role === 'maintenance' && report.assignedTeamId === user.teamId ? (
          <section className="card space-y-3 p-4 sm:p-5">
            <h2 className="font-semibold text-navy-900">Maintenance actions</h2>
            <label className="block text-sm">
              Progress remarks
              <textarea value={progress} onChange={(event) => setProgress(event.target.value)} rows={3} className="input mt-1" />
            </label>
            <label className="block text-sm">
              Completion photograph (optional)
              <input
                type="file"
                accept="image/*"
                className="mt-1 w-full text-sm"
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  try {
                    setPhoto(await fileToDataUrl(file, MAX_IMAGE_BYTES))
                  } catch (err) {
                    push(err.message, 'error')
                  }
                }}
              />
            </label>
            {photo ? <img src={photo} alt="Completion preview" className="max-h-40 rounded-xl object-cover" /> : null}
            {report.status === 'Maintenance Assigned' ? (
              <button
                disabled={busy}
                onClick={() => run(() => addMaintenanceProgress(report.id, { remarks: progress, startWork: true }, user), 'Task marked in progress.')}
                className="btn-primary w-full"
              >
                Start work
              </button>
            ) : null}
            <button
              disabled={busy}
              onClick={() => run(() => addMaintenanceProgress(report.id, { remarks: progress, completionImageUrl: photo }, user), 'Progress saved.')}
              className="btn-secondary w-full"
            >
              Save progress note
            </button>
            {['Maintenance Assigned', 'In Progress'].includes(report.status) ? (
              <button
                disabled={busy}
                onClick={() =>
                  run(
                    () => addMaintenanceProgress(report.id, { remarks: progress, completionImageUrl: photo, complete: true }, user),
                    'Marked completed for administrator review.',
                  )
                }
                className="btn-primary w-full bg-emerald-700 hover:bg-emerald-800"
              >
                Mark completed
              </button>
            ) : null}
          </section>
        ) : null}
      </aside>

      <Modal
        open={rejectOpen}
        title="Reject report"
        onClose={() => setRejectOpen(false)}
        footer={
          <button
            disabled={busy}
            onClick={() =>
              run(async () => {
                await rejectReport(report.id, reason, user)
                setRejectOpen(false)
                setReason('')
              }, 'Report rejected.')
            }
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-red-600 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            Confirm rejection
          </button>
        }
      >
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} className="input" placeholder="Explain why this report is being rejected." />
      </Modal>

      <Modal
        open={assignOpen}
        title="Assign maintenance team"
        onClose={() => setAssignOpen(false)}
        footer={
          <button
            disabled={busy}
            onClick={() =>
              run(async () => {
                await assignMaintenance(report.id, teamId, user)
                setAssignOpen(false)
              }, 'Maintenance team assigned.')
            }
            className="btn-primary w-full"
          >
            Assign team
          </button>
        }
      >
        <select value={teamId} onChange={(event) => setTeamId(event.target.value)} className="input">
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name} — {team.zone}
            </option>
          ))}
        </select>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        title="Close this report?"
        message="Closing confirms the repair after administrator review. This is the final workflow step."
        confirmLabel="Close report"
        onClose={() => setConfirmClose(false)}
        busy={busy}
        onConfirm={() =>
          run(async () => {
            await closeReport(report.id, user)
            setConfirmClose(false)
          }, 'Report closed.')
        }
      />
    </div>
  )
}
