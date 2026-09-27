# State Religious Landscape & Power Context Methodology

This module adds demographic and institutional context to the 50-state Religion & Law project. It is intentionally separate from the A–E legal-classification system.

## Questions answered

For each state, this layer may answer:

1. What religious traditions do adults in the state report belonging to?
2. What share is religiously unaffiliated?
3. Which traditions are largest in the available survey?
4. Which current state power positions are being tracked?
5. For which officeholders is a religious affiliation publicly documented?
6. Is the evidence strong enough to describe the religious composition of the tracked power set?

## Population data

The first-pass population source is Pew Research Center's 2023–24 Religious Landscape Study (RLS), which surveyed adults in all 50 states.

Rules:

- Treat percentages as **survey estimates**, not census counts.
- Display the survey period and state-specific margin of error when available.
- Do not manufacture a broad "Christian total" by summing rounded subgroups unless the source directly reports it or the record explicitly labels the result as derived.
- Keep "<1%" as "<1%"; do not silently convert it to 0%.
- Do not compare small differences as meaningful when margins of error overlap.
- Link directly to the state's Pew RLS page.

## Institutional-power snapshot

The standard first-pass state power set is:

- Governor
- Lieutenant governor, when the state has one
- Attorney general
- Speaker of the lower legislative chamber
- President pro tempore / equivalent leader of the upper legislative chamber
- Chief justice of the state's highest court

A later expansion may add congressional delegations, statewide elected boards, cabinet leadership, and major local offices.

## Religious affiliation of officeholders

Religious affiliation is recorded only when it is publicly documented in a reliable source.

Acceptable evidence includes:

1. A direct statement by the officeholder.
2. An official biography identifying a church, denomination, clergy role, or religious affiliation.
3. A reputable survey or biographical reference based on direct reporting, such as Pew/CQ Roll Call for members of Congress.
4. A current official caucus biography identifying church membership or similar affiliation.

Do **not** infer religion from:

- name
- race or ethnicity
- family background
- school attended
- policy positions
- party affiliation
- use of religious language alone
- geographic location

If no reliable public affiliation is found, record **Unknown / not publicly documented**.

## Representation claims

A statement such as "the tracked power positions are mainly Christian" requires adequate coverage of the tracked positions. Known affiliations are always reported with the denominator.

Example:

> 3 of 6 tracked positions have publicly documented affiliations; all three documented affiliations are Christian. The remaining three are unknown, so the religious composition of the full six-position set cannot be determined.

This is different from saying "50% are Christian" or "the leadership is Christian."

## Separation from legal causation

Population religion and officeholder religion are contextual variables. They do not establish that a law was caused by religion.

The project therefore keeps these separate:

- legal text
- historical causation
- current legal status
- population religious composition
- officeholder religious affiliation

A correlation among those fields is not coded as causation without independent historical evidence.

## Refresh cadence

- Population survey records: refresh when Pew releases a new comparable state-level RLS.
- Officeholder records: review after elections, appointments, leadership changes, resignations, or at least annually.
- Every state context record must carry a coverage status and verification date once coded.
