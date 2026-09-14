# Student Consultation and Counseling Session System

## BSc Project Documentation Draft

**Project type:** Web-based information system  
**Target users:** Students, counselors, and institutional administrators  
**Recommended project title:** *Design and Implementation of a Web-Based Student Consultation and Counseling Session System*

> This draft is written around the current Student Support Hub implementation. Replace institution-specific names, student statistics, supervisor details, and screenshots before submission.

---

## Abstract

Students in tertiary institutions often need academic guidance, emotional support, career direction, or help adjusting to university life. When consultation and counseling services are managed manually, students may experience delays, difficulty finding available counselors, weak appointment tracking, and uncertainty about the privacy of their records.

This project presents the design and implementation of a web-based Student Consultation and Counseling Session System. The system gives students a secure account through which they can request appointments, browse counselor profiles, review approved sessions, and access summaries that have been shared with them. Counselors can review requests, approve or reschedule appointments, manage their availability, and create session records. Administrators can manage operational access, review service activity, and generate reports without viewing private counseling note content.

The system uses role-based access control so that features are shown according to the authenticated user's role. Clerk provides account authentication and session management, while the application applies Student, Counselor, and Administrator permissions. The interface was designed with a calm, privacy-focused visual language to reduce the anxiety commonly associated with asking for help. The result is a responsive web application that can be developed and run on Windows 10 using Visual Studio Code.

**Keywords:** student support, counseling management, consultation scheduling, role-based access control, web-based system, privacy, tertiary institution

---

# Chapter One: Introduction

## 1.1 Background of the Study

Information and Communication Technology has transformed teaching, learning, communication, administration, and student support services. Tertiary institutions increasingly use web applications to provide faster, more accessible, and more organized services.

Consultation and counseling are important parts of student development. Consultation helps students obtain academic guidance from lecturers, advisors, or support staff. Counseling helps students address personal, emotional, social, career, and adjustment-related challenges. These services can improve academic progress, decision-making, wellbeing, and the student's ability to remain engaged with school.

In many institutions, appointments are still arranged through physical visits, telephone calls, email messages, or paper registers. These methods make it difficult to maintain an accurate calendar, notify students of changes, retrieve previous records, and enforce confidentiality. A web-based Student Consultation and Counseling Session System can provide a single controlled environment for appointment management, communication, record keeping, and administrative reporting.

The proposed system, named **Student Support Hub**, uses a role-based design. Students see their own support activities, counselors see their assigned work, and administrators see operational information. This separation is important because counseling information is sensitive and should not be available to every user of the institution.

## 1.2 Statement of the Problem

Manual consultation and counseling processes can cause the following problems:

1. Students may wait too long to obtain an appointment.
2. Available counselor times may not be visible to students.
3. Appointment changes may not reach every person involved.
4. Paper or scattered electronic records may be lost, duplicated, or difficult to retrieve.
5. Confidential counseling information may be exposed to unauthorized people.
6. Counselors may not have a clear view of pending requests and assigned students.
7. Administrators may lack accurate reports about service demand, attendance, and response time.
8. Users may access functions that do not belong to their responsibilities when role permissions are not enforced.

## 1.3 Aim of the Study

The aim of this project is to design and implement a secure web-based Student Consultation and Counseling Session System that improves appointment scheduling, counseling record management, privacy, communication, and administrative oversight in a tertiary institution.

## 1.4 Objectives of the Study

The objectives are to:

1. Design a web-based platform for student consultation and counseling services.
2. Provide secure account registration and sign-in.
3. Enforce role-based access for Students, Counselors, and Administrators.
4. Allow students to browse counselors and request appointments.
5. Allow counselors to approve, reschedule, or cancel appointments.
6. Allow counselors to create shared session summaries and private notes.
7. Prevent administrators from viewing private counseling note content.
8. Provide operational dashboards and activity reports for administrators.
9. Provide a responsive interface for desktop and mobile browsers.
10. Document the system so that it can be installed and maintained on Windows 10 using Visual Studio Code.

## 1.5 Research Questions

1. How can a web application improve student consultation and counseling appointment management?
2. How can role-based access control protect sensitive counseling information?
3. How can students request and track support without relying on paper-based processes?
4. How can counselors manage requests and records more efficiently?
5. What operational information should administrators see without accessing private counseling notes?

## 1.6 Significance of the Study

### Students

Students receive a more accessible way to find support, request appointments, review session details, and read summaries shared by their counselor.

### Counselors

Counselors receive a clearer work queue, appointment controls, availability management, and structured record keeping.

### Institution

The institution receives improved service visibility, reduced paperwork, better appointment coordination, and clearer accountability.

### Researchers

The system can serve as a reference for research into student information systems, digital wellbeing support, privacy, and role-based access.

## 1.7 Scope of the Study

The system covers:

- Account sign-in and sign-up.
- Authenticated Student, Counselor, and Administrator workspaces.
- Counselor discovery and support-area search.
- Appointment requests, approval, rescheduling, and cancellation.
- Counselor availability management.
- Shared session summaries and private counselor notes.
- Administrator service metrics, user directory, audit activity, and report export.
- Privacy settings and notification preferences.
- Responsive desktop and mobile web layouts.

The first implementation does not include:

- Video conferencing.
- Online diagnosis.
- Artificial-intelligence counseling.
- Emergency response or crisis intervention.
- Direct integration with an institution's student information system.
- Production database persistence for counseling records.

## 1.8 Limitations of the Study

The current prototype uses local browser persistence for demonstration data. Clerk provides real user authentication and the API server contains authenticated session handling, but a production deployment should move appointments, records, availability, and audit data into a secured database. The system should also receive a formal privacy review, retention policy, backup plan, and institution-approved crisis escalation process before use with real counseling records.

## 1.9 Definition of Terms

- **Authentication:** The process of verifying the identity of a user.
- **Authorization:** The process of deciding which authenticated user can access a function or record.
- **Counselor:** A staff member assigned to provide consultation or counseling support.
- **Appointment:** A scheduled consultation or counseling meeting.
- **Role-based access control:** A security approach in which permissions are assigned according to a user's role.
- **Session record:** A record created after or during a support session.
- **Private note:** Counselor-only content that is not shared with students or administrators.
- **Shared summary:** A session summary intentionally made visible to the student.
- **Administrator:** A user who manages access, service operations, and reports.

---

# Chapter Two: Literature and Conceptual Review

## 2.1 Consultation and Counseling in Higher Education

Student support services contribute to academic persistence, wellbeing, adjustment, and career development. Students may need support because of academic pressure, financial stress, relationships, identity, grief, trauma, disability, or uncertainty about their future. A support system should therefore make access understandable and respectful.

## 2.2 Web-Based Information Systems

A web-based information system combines user interfaces, application logic, data storage, authentication, and reporting. Its main advantage is that authorized users can access services through a browser without installing a special desktop application. This is suitable for a university environment where students and staff may use different devices.

## 2.3 Appointment Scheduling Systems

Appointment systems reduce uncertainty by centralizing available time slots, requests, approvals, and changes. They also make it possible to calculate service demand, attendance, response times, and counselor workload.

## 2.4 Confidentiality and Access Control

Counseling records require stronger privacy controls than ordinary administrative records. A student should see only their own records and summaries intentionally shared with them. A counselor should see records for assigned students. An administrator may need service counts and user status but should not see private note content.

Authentication alone is not enough. The system must also authorize actions. This is why Student Support Hub uses both authenticated sessions and role-specific navigation and route behavior.

## 2.5 Conceptual Model

The system follows this flow:

```text
User registration/sign-in
          |
          v
Authenticated session
          |
          v
Role resolution
  |          |           |
Student   Counselor   Administrator
  |          |           |
Request   Review      Manage access
support   sessions    and reports
  |          |           |
  +------ appointment --+
          |
          v
Shared summary / private note boundary
```

---

# Chapter Three: System Analysis and Design

## 3.1 Analysis of the Existing Process

The manual process usually contains the following stages:

1. Student searches for a counselor or asks a staff member for help.
2. Appointment details are exchanged by email, phone, or in person.
3. Counselor confirms a time manually.
4. Notes are stored in paper files or separate digital documents.
5. Administrator requests service information from individual staff members.

This process creates delays and makes access control difficult to audit.

## 3.2 Proposed System

The proposed system provides:

- Public landing page explaining the service.
- Secure Clerk sign-in and sign-up.
- A protected application shell for authenticated users.
- A role determined from the authenticated user's assigned metadata.
- Student, Counselor, and Administrator permissions.
- Appointment and record workflows.
- Privacy boundary messaging throughout the interface.
- Windows 10 setup documentation.

## 3.3 Functional Requirements

| ID | Requirement |
|---|---|
| FR01 | The system shall allow a user to create an account. |
| FR02 | The system shall allow a user to sign in and sign out. |
| FR03 | The system shall identify the user's assigned role. |
| FR04 | The system shall show Student functions to Student users. |
| FR05 | The system shall show Counselor functions to Counselor users. |
| FR06 | The system shall show Administrator functions only to Administrator users. |
| FR07 | Students shall be able to search counselor profiles. |
| FR08 | Students shall be able to request and cancel appointments. |
| FR09 | Counselors shall be able to approve, reschedule, and cancel appointments. |
| FR10 | Counselors shall be able to create shared and private notes. |
| FR11 | Administrators shall be able to view operational metrics and audit activity. |
| FR12 | Administrators shall not view private counseling note content. |
| FR13 | The system shall provide notification and privacy settings. |
| FR14 | The system shall respond to desktop and mobile screen sizes. |

## 3.4 Non-Functional Requirements

- **Security:** Authentication, role checks, protected routes, secure cookies, and no client-side role switching.
- **Usability:** Clear labels, predictable navigation, responsive layouts, empty states, and action feedback.
- **Privacy:** Private note content must be separated from shared summaries and administrator reports.
- **Performance:** Main dashboard assets should load efficiently on ordinary campus internet connections.
- **Maintainability:** Source code should be organized into reusable React components and documented workflows.
- **Portability:** The project should run on Windows 10 with Visual Studio Code, Node.js, and pnpm.

## 3.5 Role-Permission Matrix

| Feature | Student | Counselor | Administrator |
|---|:---:|:---:|:---:|
| View public landing page | Yes | Yes | Yes |
| Create account / sign in | Yes | Yes | Yes |
| View own dashboard | Yes | Yes | Yes |
| Browse counselors | Yes | Yes | Yes |
| Request appointment | Yes | No | No |
| Approve appointment | No | Yes | No |
| Reschedule appointment | Own request | Assigned requests | Operational oversight |
| Manage availability | No | Yes | No |
| View own shared summaries | Yes | No | No |
| Create session records | No | Yes | No |
| View private counselor note content | No | Assigned counselor | No |
| View service metrics | No | Limited personal workload | Yes |
| Manage user access | No | No | Yes |
| View audit activity | No | No | Yes |

## 3.6 Security Design

1. Clerk handles account creation, sign-in, sign-out, and browser sessions.
2. The client resolves the role from authenticated user metadata.
3. Unauthenticated users see the public landing page and cannot access the portal.
4. Counselor and Administrator views are not exposed through the Student navigation.
5. The Administration page refuses access for non-administrators.
6. The API server uses Clerk middleware and provides an authenticated `/api/session` check.
7. Roles default to Student when no elevated role is assigned.
8. Private notes are kept separate from shared summaries and administrator views.

## 3.7 Main Data Entities

### User

`id`, `name`, `email`, `role`, `status`, `createdAt`

### Counselor

`id`, `name`, `specialty`, `bio`, `availability`, `active`

### Appointment

`id`, `studentId`, `counselorId`, `date`, `time`, `type`, `status`, `requestNote`

### Session Record

`id`, `appointmentId`, `studentId`, `counselorId`, `sharedSummary`, `privateNote`, `createdAt`

### Audit Event

`id`, `actorId`, `action`, `resourceType`, `resourceId`, `createdAt`

## 3.8 System Architecture

```text
Browser
  |
  | React + Vite interface
  | Clerk browser session
  v
Shared proxy / API server
  |
  | Clerk Express middleware
  | Authenticated session endpoint
  v
Application services
  |
  v
PostgreSQL database in production
```

The current demonstration build keeps example appointment and record data in browser storage so that the interface can be evaluated without a database. A production version should replace browser storage with authenticated API endpoints backed by PostgreSQL.

---

# Chapter Four: System Implementation

## 4.1 Development Tools

- Visual Studio Code
- Windows 10
- Node.js LTS
- pnpm
- React
- Vite
- TypeScript
- Tailwind CSS
- Wouter
- Lucide icons
- Clerk authentication
- Express API server

## 4.2 Authentication Implementation

The application uses Clerk-managed authentication rather than storing passwords in the application. The client provides dedicated `/sign-in` and `/sign-up` routes with branded appearance settings. The API server mounts Clerk middleware before the application routes and exposes an authenticated session endpoint.

The role is assigned through Clerk user metadata:

```json
{
  "role": "student"
}
```

Valid elevated values are:

```json
{
  "role": "counselor"
}
```

or:

```json
{
  "role": "administrator"
}
```

If no elevated role exists, the system safely treats the user as a Student.

## 4.3 User Interface Implementation

The interface contains:

- Public landing page.
- Branded authentication pages.
- Protected workspace shell.
- Role-aware navigation.
- Dashboard.
- Appointments.
- Counselors.
- Records.
- Administration.
- Settings.

The interface uses a dark teal navigation rail, warm background surfaces, coral action buttons, and privacy-focused status messaging.

## 4.4 Appointment Implementation

Students select a counselor, preferred date, preferred time, and optional message. The appointment starts in the `requested` state. A counselor can approve it, reschedule it, or cancel it. Students can cancel their own requested or confirmed appointments.

## 4.5 Record Implementation

Counselors can enter a summary and a private note. The summary may be shared with the student. The private note remains visible only in the counselor's workspace. Administrators receive a privacy boundary message and operational record counts without private note content.

## 4.6 Windows 10 and Visual Studio Code Support

The project can be developed without Linux-specific commands by using PowerShell in the Visual Studio Code terminal. The exact setup is in `docs/Windows-10-Visual-Studio-Code-Setup.md`.

---

# Chapter Five: Testing, Conclusion, and Recommendations

## 5.1 Testing Approach

Testing should cover authentication, authorization, appointment workflows, record privacy, responsive layout, and error states.

## 5.2 Test Cases

| Test ID | Test | Expected result |
|---|---|---|
| T01 | Open the base URL while signed out | Public landing page appears |
| T02 | Select Create account | Clerk sign-up screen appears |
| T03 | Select Sign in | Clerk sign-in screen appears |
| T04 | Sign in as a Student | Student portal opens and Administration is unavailable |
| T05 | Open `/administration` as a Student | Restricted access message appears |
| T06 | Sign in with Counselor metadata | Counselor workspace and appointment review actions appear |
| T07 | Approve a requested appointment | Status changes to Confirmed |
| T08 | Create a private counselor note | Note appears to counselor only |
| T09 | Sign in as Administrator | Administration workspace appears |
| T10 | Review records as Administrator | Private note content remains hidden |
| T11 | Sign out | User returns to the public landing page |
| T12 | Resize to mobile width | Navigation and content remain usable |

## 5.3 Conclusion

The Student Consultation and Counseling Session System addresses the major weaknesses of manual appointment and record management. It provides a single web interface for students, counselors, and administrators while respecting the privacy boundary between care content and service operations.

The use of authenticated accounts and role-based permissions improves security compared with a role switcher or an unrestricted shared dashboard. The application also provides a foundation for future database persistence, institutional integration, notifications, and audit reporting.

## 5.4 Recommendations

Before production use, the following improvements are recommended:

1. Add PostgreSQL persistence for all operational and counseling data.
2. Enforce authorization again on every protected API endpoint.
3. Add a formal role-management workflow restricted to approved administrators.
4. Add database backups, retention rules, and recovery procedures.
5. Add email notifications for appointment changes.
6. Add institution-approved emergency and safeguarding guidance.
7. Conduct accessibility, penetration, privacy, and user acceptance testing.
8. Add audit logging for every access to sensitive records.
9. Deploy separate Development and Production authentication environments.
10. Train counselors and administrators on confidentiality responsibilities.

---

## References

Use your institution's required referencing style. The following references are suitable starting points:

Corey, G. (2021). *Theory and Practice of Counseling and Psychotherapy* (10th ed.). Cengage Learning.

Gibson, R. L., & Mitchell, M. H. (2016). *Introduction to Counseling and Guidance* (7th ed.). Pearson.

Laudon, K. C., & Laudon, J. P. (2022). *Management Information Systems: Managing the Digital Firm* (17th ed.). Pearson.

O'Brien, J. A., & Marakas, G. M. (2019). *Management Information Systems* (11th ed.). McGraw-Hill Education.

Turban, E., Pollard, C., & Wood, G. (2018). *Information Technology for Management* (11th ed.). Wiley.

---

## Suggested Appendices

- Appendix A: Screenshots of the landing page, sign-in page, Student dashboard, Counselor appointments, and Administrator reports.
- Appendix B: Role-permission matrix.
- Appendix C: Test-case results.
- Appendix D: Windows setup instructions.
- Appendix E: Database schema for the production phase.
