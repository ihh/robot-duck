

BOSS = $(HOME)/machineboss/bin/boss

data/bsc.sim.json: data/bsc.json
	$(BOSS) $< --random-encode --input-chars 001010100001010 >$@

%.align.json: %.sim.json
	$(BOSS) data/bsc.json --data $< --align >$@

.SECONDARY:
