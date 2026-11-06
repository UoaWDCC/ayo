---
name: Backend feature template
about: Features relating to the backend
title: "[BACKEND] "
type: Feature
labels: backend
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
<!-- A clear and concise description of what the problem is. Ex. I'm always frustrated when [...] -->

**Describe the solution you'd like**
<!-- A clear and concise description of what you want to happen. -->

**Describe alternatives you've considered**
<!-- A clear and concise description of any alternative solutions or features you've considered. -->

**Additional context**
<!-- Add any other context or screenshots about the feature request here. -->

**BEFORE MERGING**
- [ ] Integration test written for services
- [ ] [Schemas annotated](https://payloadcms.com/docs/configuration/collections) if adding new models
- [ ] Code generation run (*hint*: `pnpm generate:types`)
- [ ] Appropriate mocks created where possible
- [ ] PR Reviewed (For non-trivial changes)
- [ ] Changes tested against the latest main branch (run `git fetch origin`, then `git merge origin/main`)
- [ ] All required PR checks passing
