# InputHistory
#
# Douglas Thrift
#
# GNUmakefile

ifeq ($(OS),Windows_NT)
SED := C:\cygwin\bin\sed.exe
SED_FLAG := -re
ZIP := C:\cygwin\bin\zip.exe
PROFILE := $(subst /,\,$(firstword $(wildcard $(APPDATA)/Instantbird/Profiles/*.default)))
RM_F := del /F /A
else
ifeq ($(OS), OSX)
SED_FLAG := -Ee
else
SED_FLAG := -re
endif
SED := sed
ZIP := zip
PROFILE := $(firstword $(wildcard ~/.instantbird/*.default))
RM_F := rm -f
endif

files := install.rdf bootstrap.js
id := $(firstword $(shell $(SED) $(SED_FLAG) "s|^.*<em:id>(.+)</em:id>.*$$|\1|p;d" install.rdf))
version := $(shell $(SED) $(SED_FLAG) "s|^.*<em:version>(.+)</em:version>.*$$|\1|p;d" install.rdf)
xpi := $(shell echo $(id) | $(SED) $(SED_FLAG) "s/^(.+)@.*$$/\1/")-$(version).xpi
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
	echo $(cwd)> $(shortcut)

deinstall:
	-$(RM_F) $(shortcut)

uninstall: deinstall

clean:
	-$(RM_F) *.xpi
