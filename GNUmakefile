# InputHistory
#
# Douglas Thrift
#
# GNUmakefile

ifeq ($(OS),Windows_NT)
SED := $(subst /,\,$(lastword $(wildcard C:/cygwin*/bin/sed.exe)))
ZIP := $(subst /,\,$(lastword $(wildcard C:/cygwin*/bin/zip.exe)))
PROFILE := $(subst /,\,$(firstword $(wildcard $(APPDATA)/Instantbird/Profiles/*.default)))
MKDIR_P := $(subst /,\,$(lastword $(wildcard C:/cygwin*/bin/mkdir.exe))) -p
RM_F := del /F /A
else
SED := sed
ZIP := zip
PROFILE := $(firstword $(wildcard ~/.instantbird/*.default))
MKDIR_P := mkdir -p
RM_F := rm -f
endif

files := install.rdf bootstrap.js
id := $(firstword $(shell $(SED) -re "s|^.*<em:id>(.+)</em:id>.*$$|\1|p;d" install.rdf))
version := $(shell $(SED) -re "s|^.*<em:version>(.+)</em:version>.*$$|\1|p;d" install.rdf)
xpi := $(shell echo $(id) | $(SED) -re "s/^(.+)@.*$$/\1/")-$(version).xpi
shortcut := $(PROFILE)/extensions/$(id)
cwd := $(CURDIR)/

ifeq ($(OS),Windows_NT)
shortcut := $(subst /,\,$(shortcut))
cwd := $(subst /,\,$(cwd))
endif

.PHONY: all install deinstall uninstall clean

all: $(xpi)

$(xpi): $(files)
	$(ZIP) -ll $(xpi) $(files)

install:
	$(MKDIR_P) $(dir $(shortcut))
	echo $(cwd)> $(shortcut)

deinstall:
	-$(RM_F) $(shortcut)

uninstall: deinstall

clean:
	-$(RM_F) *.xpi
