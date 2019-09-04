

BOSS = $(HOME)/machineboss/bin/boss

data/bsc.sim.json: data/bsc.machine.json
	$(BOSS) $< --random-encode --input-chars 00101010000101011101010111 >$@

data/bintern.sim.json: data/bintern.machine.json
	$(BOSS) $< --random-encode --input-chars 00101010000101011101010111 >$@

data/terndna.sim.json: data/terndna.machine.json
	$(BOSS) $< --random-encode --input-chars 01021101022102122211 >$@

data/bindna.sim.json: data/bindna.machine.json
	$(BOSS) $< --random-encode --input-chars 00101010000101011101010111 >$@

%.align.json: %.sim.json
	$(BOSS) $*.machine.json --data $< --align >$@

.SECONDARY:
