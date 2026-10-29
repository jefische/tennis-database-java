import { memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TournamentFilterItem, YearFilterItem } from "@/types";

type FilterRowProps = {
	id: string;
	filterKey: string;
	label: string | number;
	count: number;
	checked: boolean;
	item: TournamentFilterItem | YearFilterItem;
	onToggle: (key: string, checked: boolean) => void;
};

const FilterRow = memo(function FilterRow({ id, filterKey, label, count, checked, onToggle }: FilterRowProps) {
	return (
		<li className="flex items-center p-1">
			<Checkbox
				id={id}
				className="size-4"
				checked={checked}
				onCheckedChange={(c) => onToggle(filterKey, c as boolean)}
			/>
			<Label htmlFor={id} className="ps-[10px] text-base">
				{label} ({count})
			</Label>
		</li>
	);
});

export default FilterRow;
