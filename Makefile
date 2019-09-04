

BOSS = $(HOME)/machineboss/bin/boss

data/bsc.sim.json: data/bsc.json
	$(BOSS) $< --random-encode --input-chars 00101010000101011101010111 >$@

%.align.json: %.sim.json
	$(BOSS) data/bsc.json --data $< --align >$@

.SECONDARY:
