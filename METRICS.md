# Metrics

The North Star metric for StackSpend is **qualified audit completions**. I do not want to optimize for raw visits because this product is not a media site and it is not a daily-use consumer app. A qualified audit completion means someone entered enough real spend detail to generate a meaningful recommendation and reached the results page. That event captures both intent and product value: the user had a real cost problem, trusted the app enough to enter data, and received an output worth considering.

Three input metrics matter most for driving that North Star.

First is **landing-page-to-audit-start rate**. If people do not begin the form, the messaging is not sharp enough or the product looks too lightweight to trust.

Second is **audit-start-to-audit-complete rate**. This shows whether the form is too long, too confusing, or too weakly structured. Because the product is lead-gen oriented, the audit itself is the core activation event.

Third is **audit-complete-to-share-or-lead-submit rate**. This matters because a useful B2B audit should produce one of two reactions: "I want someone to help me act on this" or "I want to forward this to someone else." If neither happens, the output may be interesting but not compelling.

The first instrumentation I would add is event tracking for:

- landing page view
- CTA click
- form started
- audit completed
- lead form submitted
- public report viewed
- public report shared or copied

The pivot signal I would watch is low qualified audit completion despite decent traffic. If at least 100 relevant visitors produce fewer than 10 completed audits, I would treat that as a message-product mismatch and revisit positioning, friction, or trust. If the app can get people to complete audits but almost nobody shares a report or submits a lead, that suggests the output is not strong enough or the value capture layer is misaligned.

At this stage, the right metrics are not DAU and vanity growth charts. They are proof that the right user understands the promise, completes the workflow, and cares enough about the result to act on it.
