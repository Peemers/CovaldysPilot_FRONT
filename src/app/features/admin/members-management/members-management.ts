import {Component, inject, OnInit, signal, TemplateRef, ViewChild} from '@angular/core';
import {UserService} from '../../../shared/services/user';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {UserResponseDto} from '../../../shared/models/user.models';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DatePipe} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-members-management',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DatePipe,
    MatTooltip,
    MatMenuModule,
    MatDialogModule,
  ],
  templateUrl: './members-management.html',
  styleUrl: './members-management.scss',
})
export class MembersManagement implements OnInit {
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  members = signal<UserResponseDto[]>([]);
  isLoading = signal(true);

  readonly displayedColumns = ['pseudo', 'firstName', 'email', 'status', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading.set(true);
    this.userService.getAll().subscribe({
      next: (members: UserResponseDto[]) => {
        this.members.set(members);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des membres.', 'Fermer', {duration: 3000});
        this.isLoading.set(false);
      }
    });
  }

  delete(id: string): void {
    if (!window.confirm('Supprimer ce membre définitivement ?')) return;
    this.userService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Membre supprimé !', 'Fermer', {duration: 3000});
        this.loadMembers();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000});
      }
    });
  }

  exportMembers(filter?: string): void {
    this.userService.exportMembers(filter).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `membres_${filter ?? 'all'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'export.', 'Fermer', {duration: 3000});
      }
    });
  }
  @ViewChild('memberDetailDialog') memberDetailDialog!: TemplateRef<unknown>;
  private readonly dialog = inject(MatDialog);
  selectedMember = signal<UserResponseDto | null>(null);

  openDetail(member: UserResponseDto): void {
    this.selectedMember.set(member);
    this.dialog.open(this.memberDetailDialog, {
      width: '500px'
    });
  }
}
