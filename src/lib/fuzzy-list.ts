import nfzf from 'node-fzf';

type fzfResult = {
  selected: {
    value: string;
    index: number;
  };
  query: string;
};

const fuzzyProcess = (fn: (item: string) => void, items: string[]) => {
  nfzf(items, (result: fzfResult) => {
    const { selected, query } = result;

    if (!selected) {
      console.log('No matches for:', query);
    } else {
      fn(selected.value);
    }
  });
};

export { fuzzyProcess };
