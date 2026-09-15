# ABBREVIATE focused legacy recalibration

Author: Jinkai Liu · 2026-09-15

Base: 7a331b0b8040bb850c7a38dfce3b2fb8b53b1d25. Existing ID LB-en-abbreviate-035 retained; no duplicate entry. The baseline has no standalone word page (page=null); this release adds the requested page to the existing record.

## Decision

Headline: ABBREVIATE ↔ 瘪 biě · 缩写／简略. Standard translation stays separate: 缩写／使简略／缩短. abbreviation is a related noun, not a verb sense. Published describes the delivered page; Candidate / D / Low describes the mapping. Legacy C is reassessed as D (intentional cross-domain association, weak lexical fit, unvalidated sound comparison). Historical Relation: Not claimed.

## Sources and scope

- [languagesbook.com legacy entry: abbreviate / abbreviation，简略／节略。瘪 bie](https://languagesbook.com/glossary/abbreviate%ef%bc%8c%e7%ae%80%e7%95%a5%e3%80%82%e7%98%aabie/): author-published legacy website; imported 2026-09-01; original observation preserved independently from evaluation.
- [Merriam-Webster Dictionary: abbreviate](https://www.merriam-webster.com/dictionary/abbreviate): Merriam-Webster specific entry rechecked 2026-09-15; verb and Latin history.
- [languagesbook.com legacy entry: abbreviation，节略。瘪 bie](https://languagesbook.com/glossary/abbreviation/): author-published legacy website; merged into abbreviate record during import 2026-09-01.
- [Cambridge English–Chinese (Simplified) Dictionary: abbreviate](https://dictionary.cambridge.org/dictionary/english-chinese-simplified/abbreviate): English verb, IPA and bilingual gloss; not a Mainland monolingual authority.
- [Merriam-Webster Dictionary: abbreviation](https://www.merriam-webster.com/dictionary/abbreviation): Noun senses and Anglo-French / Late Latin borrowing path.
- [Dictionnaire de l’Académie française, 9e édition: abréger](https://www.dictionnaire-academie.fr/article/A9A0133): French verb and Late Latin abbreviare / brevis.
- [Dictionnaire de l’Académie française, 9e édition: abréviation](https://www.dictionnaire-academie.fr/article/A9A0138): French feminine noun; borrowed from Late Latin abbreviatio.
- [TLFi via CNRTL: abréviation](https://www.cnrtl.fr/etymologie/abr%C3%A9viation): Christian Latin abbreviatio; noun borrowing independent of modern visual segmentation.
- [汉典：瘪](https://zdic.net/hans/瘪): 大陆数字辞书平台；仅基本解释、详细解释及普通话音标栏；不冒充纸本辞书.
- [汉典：蹩](https://zdic.net/hans/蹩): 大陆数字辞书平台；仅基本解释、详细解释及普通话音标栏；不引用嵌入的其他辞书栏目.
- [Allen & Greenough: Vowel and Consonant Pronunciation](https://dcc.dickinson.edu/grammar/latin/vowel-and-consonant-pronunciation): §8, Meagan Ayer ed., DCC 2014; approximate classical Roman reference, not Late Latin audio.

English abbreviate continues Middle English abbreviaten, borrowed from Late Latin abbreviātus, participle of abbreviāre, ultimately based on brevis (short). French abréger also goes back to abbreviare; French abréviation is borrowed from Latin abbreviatio. English abbreviation came through Anglo-French abreviation from Latin abbreviātiō: a related noun, not merely an English suffix added to the modern verb.

## Sound and cognitive assessment

brev-/brevi- ↔ 瘪 biě has limited surface phonetic similarity. Latin reference [brɛw-]/[brɛwɪ-], modern English /briːv/ across the syllable boundary in /əˈbriː.vi.eɪt/, and Mandarin [piɛ˨˩˦] are different forms and layers.

Latin /b/ and English /b/ are voiced bilabial stops; Mandarin pinyin b is voiceless unaspirated [p]. Latin r and consonantal v [w], and English /r,v/, have no counterparts in biě. A b-p-m-f group hit is only a cross-language hypothesis.

Latin short e, represented here as [ɛ], partly resembles Mandarin [iɛ]; English stressed /iː/ is not [iɛ]. Latin brevi- also contains short i.

brev- is an extracted stem fragment, not a complete word or independently stressed syllable; brevi- includes a following vowel. brevis has two syllables and abbreviate four; biě has one. The English spelling brev spans /briː.v/, not a single /brɛv/ syllable.

English abbreviate stresses /briː/; abbreviation shifts primary stress to /eɪ/. Extracted Latin stems have no independent word stress; stress of the host word must not be assigned to a root fragment.

Mandarin biě has third tone (citation [214]); bié has second tone [35]. English stress and Latin vowel quantity do not match Mandarin lexical tone. Citation contours do not describe all connected-speech realizations.

Unvalidated editorial rubric: bilabial stop place/manner 4/10; partial vowel resemblance 3/8; remaining consonants 0/5; extracted unit shape 1/4; prosody 0/3. Not an acoustic measurement, cognacy probability or whole-word score.

SHORT → REDUCE → COMPRESS maps abstract language shortening to a concrete loss of fullness. FULL/LONG → REDUCE → COMPRESSED/SHORT is an interpretive schema, not a dictionary definition or an established historical development.

Mapping Score v0.2: phonetic 8/30, semantic 10/30, cognitive 13/20, contextual 4/20; total 35/100. All are unvalidated editorial judgments. Overall Low; cognitive plausibility Medium. D/Weak is a qualitative category, not a numerical cutoff. No empirical result, regular sound correspondence or common origin claimed.

## Mainland-first audit

汉典 specific 瘪/蹩 entries were read on 2026-09-15. Only platform basic/detail senses and modern IPA are used. They support the modern lexical endpoints, not the cognitive bridge. Desired specific entries in 现代汉语词典、新华字典、汉语大词典、汉语大字典、辞源 remain pending: no directly verified edition, quotation or page. Search results branded as online 新华字典 or unauthenticated print-page indexes are not treated as the named work. No early Chinese attestation or reconstruction asserted.

## Negative control and legacy

蹩 bié is Rejected-by-meaning-first: limp/sprain, dodging or restraint do not establish shortening/compression. Similar segments cannot overcome weak semantics. The original source.raw_note and literary_layer remain intact; supplemental spelling observations are stored separately. Modern French abréger / abrégé / abréviation are normalized; historical Anglo-French abreviation is not mislabeled a modern typo.

## Integration and verification

The aggregate dataset feeds dictionary/search/Mapper. The frozen Mapper HTML/JS and shared data API are unchanged. Dictionary has a narrowly scoped standard-translation read for this candidate. The focused regression checks all other records against the base and checks frozen files byte-for-byte. Older historical snapshot tests exclude this newly recalibrated entry on both sides, retaining their own case assertions. Publication count grows by one, entry count remains 40.

Run schema, all Node tests, HTML/JS/link checks, deterministic dataset/manifest rebuilds and desktop/mobile browser regression before push. Actual run and deployment results are reported separately; this audit does not claim an unperformed check.

## 2026-09-15 lexical split follow-up

At the author’s request, abbreviation now has its own noun record LB-en-abbreviation-041 and words/abbreviation.html. The verb abbreviate retains LB-en-abbreviate-035. English and French browse forms route to their respective verb/noun entries; reciprocal family links preserve the relationship. The noun standard translation is 缩写形式／缩略, covering a shortened form and the act/result of shortening. Its featured 瘪 biě mapping remains Candidate / D / Low, with Historical Relation: Not claimed and the same Mainland print-dictionary pending checks. Both records share LATIN-BREVIS-SHORT and must not be counted as independent evidence for the Chinese comparison. Earlier import notes describe historical merge provenance, not current routing. Author: Jinkai Liu.
