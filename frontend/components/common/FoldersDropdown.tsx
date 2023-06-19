import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { Check, ChevronDown, Folder } from 'react-feather';
import { Folders } from '../../types/api';

const FoldersDropdown = ({ folders }: { folders: Folders[] }) => {
  return (
    <Listbox>
      <div className="relative font-inter text-sm">
        <Listbox.Button className="relative w-full cursor-default rounded-lg px-2 py-1 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm bg-emerald-50">
          <div className="flex gap-2 items-center">
            <Check size={16} />
            <span className="block truncate">
              {folders.length} Selected Folders
            </span>
            <ChevronDown size={16} />
          </div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {folders.map((folder: Folders, idx: number) => (
              <Listbox.Option
                key={idx}
                value={folder.id}
                className="relative pl-10 pr-4 py-2"
              >
                <span className="block truncate">{folder.name}</span>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-spark-purple-600">
                  <Folder className="h-5 w-5" aria-hidden="true" />
                </span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default FoldersDropdown;
