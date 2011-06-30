// Input History
//
// Douglas Thrift
//
// bootstrap.js

/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Input History.
 *
 * The Initial Developer of the Original Code is
 * Douglas Thrift <douglas@douglasthrift.net>.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

Components.utils.import("resource:///modules/imServices.jsm");

function generatorFromArray(array)
{
    for (var index = 0; index != array.length; ++index)
        yield array[index];
}

function generatorFromEnumerator(enumerator)
{
    while (enumerator.hasMoreElements())
        yield enumerator.getNext();
}

let observer = {
    observe: function(subject, topic, data)
    {
        if (topic != "conversation-loaded")
            return;

        this.addArrowListener(subject);
    },
    addArrowListener: function(browser)
    {
        var binding = browser.ownerDocument.getBindingParent(browser);

        if (!binding || !("editor" in binding) || !binding.editor)
            return;

        binding._inputHistory = [];
        binding._inputHistoryIndex = 0;

        binding.editor.addEventListener("keypress", this.onKeyPress, true);
    },
    removeArrowListener: function(browser)
    {
        var binding = browser.ownerDocument.getBindingParent(browser);

        if (!binding || !("editor" in binding) || !binding.editor)
            return;

        binding.editor.removeEventListener("keypress", this.onKeyPress, true);

        delete binding._inputHistoryIndex;
        delete binding._inputHistory;
    },
    onKeyPress: function(event)
    {
        var editor = event.target;
        var binding = editor.ownerDocument.getBindingParent(editor);

        switch (event.keyCode)
        {
        case event.DOM_VK_RETURN:
        case event.DOM_VK_ENTER:
            if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && editor.value.length != 0 && editor.value != binding._inputHistory[binding._inputHistory.length - 1])
            {
                binding._inputHistory.push(editor.value);

                binding._inputHistoryIndex = binding._inputHistory.length;
            }

            return;
        case event.DOM_VK_UP:
        case event.DOM_VK_DOWN:
            if (event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey && binding._inputHistory.length != 0)
                break;

        default:
            return;
        }

        switch (event.keyCode)
        {
        case event.DOM_VK_UP:
            if (binding._inputHistoryIndex == 0)
                return;

            --binding._inputHistoryIndex;

            break;
        case event.DOM_VK_DOWN:
            if (binding._inputHistoryIndex == binding._inputHistory.length)
                return;

            ++binding._inputHistoryIndex;
        }

        editor.value = binding._inputHistoryIndex != binding._inputHistory.length ? binding._inputHistory[binding._inputHistoryIndex] : "";

        editor.setSelectionRange(editor.value.length, editor.value.length);
    },
};

function startup(data, reason)
{
    for each (let window in generatorFromEnumerator(Services.wm.getEnumerator("Messenger:convs")))
        for each (let tabconversation in generatorFromArray(window.document.getElementsByTagName("tabconversation")))
            for each (let browser in tabconversation.browsers)
                observer.addArrowListener(browser);

    Services.obs.addObserver(observer, "conversation-loaded", false);
}

function shutdown(data, reason)
{
    Services.obs.removeObserver(observer, "conversation-loaded");

    for each (let window in generatorFromEnumerator(Services.wm.getEnumerator("Messenger:convs")))
        for each (let tabconversation in generatorFromArray(window.document.getElementsByTagName("tabconversation")))
            for each (let browser in tabconversation.browsers)
                observer.removeArrowListener(browser);
}

function install(data, reason) {}
function uninstall(data, reason) {}

// vim: expandtab
